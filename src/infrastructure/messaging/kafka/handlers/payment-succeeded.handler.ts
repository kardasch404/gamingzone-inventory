import { Injectable } from '@nestjs/common';
import { DeductStockUseCase } from '../../../../application/use-cases/commands/deduct-stock.use-case';
import { AppLogger } from '../../../../shared/utils/logger.util';
import { PaymentSucceededEvent } from '../../events/event.types';

@Injectable()
export class PaymentSucceededEventHandler {
  private readonly logger = new AppLogger('PaymentSucceededEventHandler');

  constructor(private readonly deductStockUseCase: DeductStockUseCase) {}

  async handle(event: PaymentSucceededEvent): Promise<void> {
    this.logger.log(`Processing payment.succeeded: ${event.data.orderId}`);

    try {
      await this.deductStockUseCase.execute({
        orderId: event.data.orderId,
      });

      this.logger.log(`Stock deducted for order: ${event.data.orderId}`);
    } catch (error) {
      this.logger.error(`Failed to deduct stock for order: ${event.data.orderId}`, error);
      throw error;
    }
  }
}
