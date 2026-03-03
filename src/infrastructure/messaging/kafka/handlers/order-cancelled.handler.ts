import { Injectable } from '@nestjs/common';
import { ReleaseStockReservationUseCase } from '../../../../application/use-cases/commands/release-stock-reservation.use-case';
import { AppLogger } from '../../../../shared/utils/logger.util';
import { OrderCancelledEvent } from '../../events/event.types';

@Injectable()
export class OrderCancelledEventHandler {
  private readonly logger = new AppLogger('OrderCancelledEventHandler');

  constructor(private readonly releaseUseCase: ReleaseStockReservationUseCase) {}

  async handle(event: OrderCancelledEvent): Promise<void> {
    this.logger.log(`Processing order.cancelled: ${event.data.orderId}`);

    try {
      await this.releaseUseCase.execute({
        orderId: event.data.orderId,
        reason: event.data.reason || 'Order cancelled',
      });

      this.logger.log(`Stock released for order: ${event.data.orderId}`);
    } catch (error) {
      this.logger.error(`Failed to release stock for order: ${event.data.orderId}`, error);
      throw error;
    }
  }
}
