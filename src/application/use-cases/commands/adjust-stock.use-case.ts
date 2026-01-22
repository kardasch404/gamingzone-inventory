import { Injectable, Inject } from '@nestjs/common';
import type { IStockRepository } from '../../../domain/interfaces/stock-repository.interface';
import { AdjustStockCommand } from './adjust-stock.command';

@Injectable()
export class AdjustStockUseCase {
  constructor(
    @Inject('IStockRepository')
    private readonly stockRepository: IStockRepository,
  ) {}

  async execute(command: AdjustStockCommand): Promise<void> {
    const stock = await this.stockRepository.findBySku(command.sku, command.warehouseId);

    if (!stock) {
      throw new Error(`Stock not found for SKU: ${command.sku}`);
    }

    const difference = command.newQuantity - stock.quantity;

    if (difference > 0) {
      stock.addStock(difference, command.reason);
    } else if (difference < 0) {
      stock.deductStock(Math.abs(difference), command.reason);
    }

    await this.stockRepository.updateWithVersion(stock, stock.version);
  }
}
