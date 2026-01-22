import { Stock } from '../../../domain/aggregates/stock.aggregate';

export class LowStockAlertDTO {
  constructor(
    public readonly sku: string,
    public readonly warehouseId: string,
    public readonly available: number,
    public readonly threshold: number,
    public readonly severity: 'LOW' | 'CRITICAL',
  ) {}

  static fromDomain(stock: Stock): LowStockAlertDTO {
    const severity = stock.isOutOfStock() ? 'CRITICAL' : 'LOW';
    return new LowStockAlertDTO(
      stock.sku,
      stock.warehouseId,
      stock.available,
      stock.minThreshold,
      severity,
    );
  }
}
