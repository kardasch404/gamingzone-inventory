import { Injectable, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { IStockRepository } from '../../domain/interfaces/stock-repository.interface';
import { ReleaseStockReservationUseCase } from '../use-cases/commands/release-stock-reservation.use-case';

@Injectable()
export class ExpiredReservationsScheduler {
  constructor(
    @Inject('IStockRepository')
    private readonly stockRepository: IStockRepository,
    private readonly releaseUseCase: ReleaseStockReservationUseCase,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleExpiredReservations(): Promise<void> {
    const expiredReservations = await this.stockRepository.findExpiredReservations();

    for (const reservation of expiredReservations) {
      try {
        await this.releaseUseCase.execute({
          orderId: reservation.orderId,
          reason: 'Reservation expired',
        });
      } catch (error) {
        console.error(`Failed to release reservation ${reservation.id}:`, error);
      }
    }
  }
}
