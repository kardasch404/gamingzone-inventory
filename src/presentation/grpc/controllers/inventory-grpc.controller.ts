import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CheckStockAvailabilityHandler } from '../../../application/use-cases/queries/check-stock-availability.handler';
import { ReserveStockUseCase } from '../../../application/use-cases/commands/reserve-stock.use-case';
import { ReleaseStockReservationUseCase } from '../../../application/use-cases/commands/release-stock-reservation.use-case';
import { DeductStockUseCase } from '../../../application/use-cases/commands/deduct-stock.use-case';

@Controller()
export class InventoryGrpcController {
  constructor(
    private readonly checkAvailabilityHandler: CheckStockAvailabilityHandler,
    private readonly reserveStockUseCase: ReserveStockUseCase,
    private readonly releaseReservationUseCase: ReleaseStockReservationUseCase,
    private readonly deductStockUseCase: DeductStockUseCase,
  ) {}

  @GrpcMethod('InventoryService', 'CheckAvailability')
  async checkAvailability(data: any) {
    const result = await this.checkAvailabilityHandler.execute({
      sku: data.sku,
      warehouseId: data.warehouseId || 'primary',
      quantity: data.quantity,
    });

    return {
      available: result.isAvailable,
      availableQuantity: result.available,
    };
  }

  @GrpcMethod('InventoryService', 'ReserveStock')
  async reserveStock(data: any) {
    try {
      const result = await this.reserveStockUseCase.execute({
        sku: data.sku,
        warehouseId: data.warehouseId || 'primary',
        quantity: data.quantity,
        orderId: data.orderId,
      });

      return {
        reservationId: result.id,
        expiresAt: result.expiresAt.toISOString(),
        success: true,
      };
    } catch (error) {
      return { success: false, reservationId: '', expiresAt: '' };
    }
  }

  @GrpcMethod('InventoryService', 'ReleaseReservation')
  async releaseReservation(data: any) {
    try {
      await this.releaseReservationUseCase.execute({
        orderId: data.orderId,
      });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  @GrpcMethod('InventoryService', 'DeductStock')
  async deductStock(data: any) {
    try {
      await this.deductStockUseCase.execute({
        orderId: data.orderId,
      });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }
}
