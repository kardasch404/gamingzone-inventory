import { Injectable } from '@nestjs/common';
import { Stock } from '../../../domain/aggregates/stock.aggregate';
import { RedisService } from './redis.service';

@Injectable()
export class CacheService {
  private readonly TTL = {
    STOCK: 300,
    WAREHOUSE: 600,
    ALERTS: 900,
  };

  constructor(private readonly redis: RedisService) {}

  async getStock(sku: string, warehouseId: string): Promise<Stock | null> {
    const key = `stock:sku:${sku}:warehouse:${warehouseId}`;
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  async setStock(stock: Stock): Promise<void> {
    const key = `stock:sku:${stock.sku}:warehouse:${stock.warehouseId}`;
    await this.redis.set(key, JSON.stringify(stock), this.TTL.STOCK);
  }

  async invalidateStock(sku: string, warehouseId: string): Promise<void> {
    const key = `stock:sku:${sku}:warehouse:${warehouseId}`;
    await this.redis.del(key);
    await this.publishInvalidation('stock', { sku, warehouseId });
  }

  async getWarehouseStocks(warehouseId: string): Promise<Stock[] | null> {
    const key = `stock:warehouse:${warehouseId}`;
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  async setWarehouseStocks(warehouseId: string, stocks: Stock[]): Promise<void> {
    const key = `stock:warehouse:${warehouseId}`;
    await this.redis.set(key, JSON.stringify(stocks), this.TTL.WAREHOUSE);
  }

  async invalidateWarehouse(warehouseId: string): Promise<void> {
    await this.redis.delPattern(`stock:warehouse:${warehouseId}*`);
    await this.publishInvalidation('warehouse', { warehouseId });
  }

  async getLowStockAlerts(): Promise<any[] | null> {
    const key = 'alerts:low-stock';
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  async setLowStockAlerts(alerts: any[]): Promise<void> {
    const key = 'alerts:low-stock';
    await this.redis.set(key, JSON.stringify(alerts), this.TTL.ALERTS);
  }

  async invalidateLowStockAlerts(): Promise<void> {
    await this.redis.del('alerts:low-stock');
    await this.publishInvalidation('alerts', { type: 'low-stock' });
  }

  private async publishInvalidation(type: string, data: any): Promise<void> {
    await this.redis.publish('cache:invalidate', JSON.stringify({ type, data }));
  }

  async subscribeToInvalidations(callback: (data: any) => void): Promise<void> {
    await this.redis.subscribe('cache:invalidate', (message) => {
      callback(JSON.parse(message));
    });
  }
}
