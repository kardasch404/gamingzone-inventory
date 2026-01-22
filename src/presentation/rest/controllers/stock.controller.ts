import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CheckStockAvailabilityHandler } from '../../../application/use-cases/queries/check-stock-availability.handler';
import { AddStockUseCase } from '../../../application/use-cases/commands/add-stock.use-case';
import { AdjustStockUseCase } from '../../../application/use-cases/commands/adjust-stock.use-case';
import { GetLowStockAlertsHandler } from '../../../application/use-cases/queries/get-low-stock-alerts.handler';
import { AddStockRequestDTO, AdjustStockRequestDTO, CheckAvailabilityRequestDTO } from '../../../application/dto/request/stock-request.dto';
import { AdminGuard } from '../../guards/admin.guard';

@ApiTags('Stock')
@Controller('api/inventory/stock')
export class StockController {
  constructor(
    private readonly checkAvailabilityHandler: CheckStockAvailabilityHandler,
    private readonly addStockUseCase: AddStockUseCase,
    private readonly adjustStockUseCase: AdjustStockUseCase,
    private readonly getLowStockAlertsHandler: GetLowStockAlertsHandler,
  ) {}

  @Get(':sku/availability')
  @ApiOperation({ summary: 'Check stock availability' })
  @ApiResponse({ status: 200, description: 'Stock availability checked' })
  async checkAvailability(
    @Param('sku') sku: string,
    @Query() query: CheckAvailabilityRequestDTO,
  ) {
    return this.checkAvailabilityHandler.execute({
      sku,
      warehouseId: 'primary',
      quantity: query.quantity,
    });
  }

  @Post(':sku/add')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add stock (Admin only)' })
  @ApiResponse({ status: 200, description: 'Stock added successfully' })
  async addStock(@Param('sku') sku: string, @Body() body: AddStockRequestDTO) {
    await this.addStockUseCase.execute({
      sku,
      warehouseId: 'primary',
      quantity: body.quantity,
      reason: body.reason,
    });
    return { message: 'Stock added successfully' };
  }

  @Post(':sku/adjust')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adjust stock (Admin only)' })
  @ApiResponse({ status: 200, description: 'Stock adjusted successfully' })
  async adjustStock(@Param('sku') sku: string, @Body() body: AdjustStockRequestDTO) {
    await this.adjustStockUseCase.execute({
      sku,
      warehouseId: 'primary',
      newQuantity: body.newQuantity,
      reason: body.reason,
      performedBy: 'admin',
    });
    return { message: 'Stock adjusted successfully' };
  }

  @Get('alerts/low-stock')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get low stock alerts (Admin only)' })
  @ApiResponse({ status: 200, description: 'Low stock alerts retrieved' })
  async getLowStockAlerts(@Query('warehouseId') warehouseId?: string) {
    return this.getLowStockAlertsHandler.execute({ warehouseId });
  }
}
