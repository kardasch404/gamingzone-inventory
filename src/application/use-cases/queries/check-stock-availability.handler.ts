import { Injectable, Inject } from '@nestjs/common';
import type { IStockRepository } from '../../../domain/interfaces/stock-repository.interface';
import { StockAvailabilityDTO } from '../../dto/response/stock-availability.dto';
import { CheckStockAvailabilityQuery } from './check-stock-availability.query';

@Injectable()
export class CheckStockAvailabilityHandler {
  constructor(
    @Inject('IStockRepository')
    private readonly stockRepository: IStockRepository,
  ) {}

  async execute(query: CheckStockAvailabilityQuery): Promise<StockAvailabilityDTO> {
    const stock = await this.stockRepository.findBySku(query.sku, query.warehouseId);

    if (!stock) {
      return new StockAvailabilityDTO(query.sku, 0, false, query.quantity);
    }

    const isAvailable = stock.available >= query.quantity;

    return new StockAvailabilityDTO(query.sku, stock.available, isAvailable, query.quantity);
  }
}
