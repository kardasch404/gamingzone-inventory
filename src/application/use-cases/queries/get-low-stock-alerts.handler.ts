import { Injectable, Inject } from '@nestjs/common';
import type { IStockRepository } from '../../../domain/interfaces/stock-repository.interface';
import { LowStockAlertDTO } from '../../dto/response/low-stock-alert.dto';
import { GetLowStockAlertsQuery } from './get-low-stock-alerts.query';

@Injectable()
export class GetLowStockAlertsHandler {
  constructor(
    @Inject('IStockRepository')
    private readonly stockRepository: IStockRepository,
  ) {}

  async execute(query: GetLowStockAlertsQuery): Promise<LowStockAlertDTO[]> {
    const stocks = await this.stockRepository.findLowStock(query.warehouseId);
    return stocks.map((stock) => LowStockAlertDTO.fromDomain(stock));
  }
}
