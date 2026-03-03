import { Injectable } from '@nestjs/common';
import { ReserveStockUseCase } from '../../../../application/use-cases/commands/reserve-stock.use-case';
import { AppLogger } from '../../../../shared/utils/logger.util';
import { OrderCreatedEvent } from '../../events/event.types';

@Injectable()
export class OrderCreatedEventHandler {
  private readonly logger = new AppLogger('OrderCreatedEventHandler');

  constructor(private readonly reserveStockUseCase: ReserveStockUseCase) {}

  async handle(event: OrderCreatedEvent): Promise<void> {
    this.logger.log(`Processing order.created: ${event.data.orderId}`);

    try {
      for (const item of event.data.items) {
        await this.reserveStockUseCase.execute({
          sku: item.sku,
          warehouseId: 'primary',
          quantity: item.quantity,
          orderId: event.data.orderId,
        });
      }

      this.logger.log(`Stock reserved for order: ${event.data.orderId}`);
    } catch (error) {
      this.logger.error(`Failed to reserve stock for order: ${event.data.orderId}`, error);
      throw error;
    }
  }
}
