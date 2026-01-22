import { Injectable } from '@nestjs/common';
import { ReleaseStockReservationUseCase } from '../../../../application/use-cases/commands/release-stock-reservation.use-case';
import { AppLogger } from '../../../../shared/utils/logger.util';
import { PaymentFailedEvent } from '../../events/event.types';

@Injectable()
export class PaymentFailedEventHandler {
  private readonly logger = new AppLogger('PaymentFailedEventHandler');

  constructor(private readonly releaseUseCase: ReleaseStockReservationUseCase) {}

  async handle(event: PaymentFailedEvent): Promise<void> {
    this.logger.log(`Processing payment.failed: ${event.data.orderId}`);

    try {
      await this.releaseUseCase.execute({
        orderId: event.data.orderId,
        reason: `Payment failed: ${event.data.reason}`,
      });

      this.logger.log(`Stock released for failed payment: ${event.data.orderId}`);
    } catch (error) {
      this.logger.error(`Failed to release stock for order: ${event.data.orderId}`, error);
      throw error;
    }
  }
}
