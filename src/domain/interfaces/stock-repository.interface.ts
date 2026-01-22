import { Stock } from '../aggregates/stock.aggregate';

export interface IStockRepository {
  findById(id: string): Promise<Stock | null>;
  findBySku(sku: string, warehouseId: string): Promise<Stock | null>;
  save(stock: Stock): Promise<void>;
  updateWithVersion(stock: Stock, expectedVersion: number): Promise<boolean>;
}
