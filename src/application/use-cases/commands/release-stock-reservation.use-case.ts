import { Injectable, Inject } from '@nestjs/common';
import type { IStockRepository } from '../../../domain/interfaces/stock-repository.interface';
import { ReleaseStockReservationCommand } from './release-stock-reservation.command';

@Injectable()
export class ReleaseStockReservationUseCase {
  constructor(
    @Inject('IStockRepository')
    private readonly stockRepository: IStockRepository,
  ) {}

  async execute(command: ReleaseStockReservationCommand): Promise<void> {
    const reservation = await this.stockRepository.findReservation(command.orderId);

    if (!reservation || !reservation.isActive()) {
      throw new Error(`Active reservation not found for order: ${command.orderId}`);
    }

    const stock = await this.stockRepository.findById(reservation.stockId);

    if (!stock) {
      throw new Error(`Stock not found: ${reservation.stockId}`);
    }

    stock.releaseReservation(reservation.quantity, command.orderId);
    reservation.release();

    await this.stockRepository.updateWithVersion(stock, stock.version);
  }
}
