import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Warehouses')
@Controller('api/inventory/warehouses')
export class WarehouseController {
  @Get()
  @ApiOperation({ summary: 'List all warehouses' })
  @ApiResponse({ status: 200, description: 'Warehouses retrieved' })
  async listWarehouses() {
    return { warehouses: [] };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get warehouse by ID' })
  @ApiResponse({ status: 200, description: 'Warehouse retrieved' })
  async getWarehouse(@Param('id') id: string) {
    return { id, name: 'Primary Warehouse' };
  }

  @Get(':id/stock')
  @ApiOperation({ summary: 'Get stock in warehouse' })
  @ApiResponse({ status: 200, description: 'Warehouse stock retrieved' })
  async getWarehouseStock(@Param('id') id: string) {
    return { warehouseId: id, stock: [] };
  }
}
