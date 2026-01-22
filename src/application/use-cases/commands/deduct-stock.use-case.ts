import { Injectable, Inject } from '@nestjs/common';
import type { IStockRepository } from '../../../domain/interfaces/stock-repository.interface';
import { DeductStockCommand } from './deduct-stock.command';

@Injectable()
export class DeductStockUseCase {
  constructor(
    @Inject('IStockRepository')
    private readonly stockRepository: IStockRepository,
  ) {}

  async execute(command: DeductStockCommand): Promise<void> {
    const reservation = await this.stockRepository.findReservation(command.orderId);

    if (!reservation || !reservation.isActive()) {
      throw new Error(`Active reservation not found for order: ${command.orderId}`);
    }

    const stock = await this.stockRepository.findById(reservation.stockId);

    if (!stock) {
      throw new Error(`Stock not found: ${reservation.stockId}`);
    }

    stock.fulfillReservation(reservation.quantity);
    reservation.fulfill();

    await this.stockRepository.updateWithVersion(stock, stock.version);
  }
}
