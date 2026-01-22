import { Injectable, Inject } from '@nestjs/common';
import { generateUuidV7 } from '../../../shared/utils/uuid.util';
import type { IStockRepository } from '../../../domain/interfaces/stock-repository.interface';
import { StockReservation } from '../../../domain/entities/stock-reservation.entity';
import { InsufficientStockException } from '../../../domain/exceptions/stock.exceptions';
import { ReservationDTO } from '../../dto/response/reservation.dto';
import { ReserveStockCommand } from './reserve-stock.command';

@Injectable()
export class ReserveStockUseCase {
  constructor(
    @Inject('IStockRepository')
    private readonly stockRepository: IStockRepository,
  ) {}

  async execute(command: ReserveStockCommand): Promise<ReservationDTO> {
    const stock = await this.stockRepository.findBySku(command.sku, command.warehouseId);

    if (!stock) {
      throw new Error(`Stock not found for SKU: ${command.sku}`);
    }

    if (stock.available < command.quantity) {
      throw new InsufficientStockException(command.sku, command.quantity, stock.available);
    }

    stock.reserve(command.quantity, command.orderId);

    const reservation = StockReservation.create(
      generateUuidV7(),
      stock.id,
      command.orderId,
      command.quantity,
      30,
    );

    await this.stockRepository.updateWithVersion(stock, stock.version);
    await this.stockRepository.saveReservation(reservation);

    return ReservationDTO.fromDomain(reservation, command.sku);
  }
}
