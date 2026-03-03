import { Injectable, Inject } from '@nestjs/common';
import type { IStockRepository } from '../../../domain/interfaces/stock-repository.interface';
import { AddStockCommand } from './add-stock.command';

@Injectable()
export class AddStockUseCase {
  constructor(
    @Inject('IStockRepository')
    private readonly stockRepository: IStockRepository,
  ) {}

  async execute(command: AddStockCommand): Promise<void> {
    const stock = await this.stockRepository.findBySku(command.sku, command.warehouseId);

    if (!stock) {
      throw new Error(`Stock not found for SKU: ${command.sku}`);
    }

    stock.addStock(command.quantity, command.reason);

    await this.stockRepository.updateWithVersion(stock, stock.version);
  }
}
