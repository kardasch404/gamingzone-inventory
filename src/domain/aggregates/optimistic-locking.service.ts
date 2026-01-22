import { Stock } from '../aggregates/stock.aggregate';
import { ConcurrentUpdateException } from '../exceptions/stock.exceptions';
import { IStockRepository } from '../interfaces/stock-repository.interface';

export class OptimisticLockingService {
  constructor(
    private readonly stockRepository: IStockRepository,
    private readonly maxRetries: number = 3,
  ) {}

  async executeWithRetry<T>(
    sku: string,
    warehouseId: string,
    operation: (stock: Stock) => T,
  ): Promise<T> {
    let attempt = 0;

    while (attempt < this.maxRetries) {
      const stock = await this.stockRepository.findBySku(sku, warehouseId);

      if (!stock) {
        throw new Error(`Stock not found for SKU: ${sku}`);
      }

      const currentVersion = stock.version;
      const result = operation(stock);

      const updated = await this.stockRepository.updateWithVersion(
        stock,
        currentVersion,
      );

      if (updated) {
        return result;
      }

      attempt++;
      await this.sleep(100 * attempt);
    }

    throw new ConcurrentUpdateException(sku);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
