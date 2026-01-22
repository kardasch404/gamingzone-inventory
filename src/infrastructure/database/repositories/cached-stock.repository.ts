import { Injectable } from '@nestjs/common';
import { Stock } from '../../../domain/aggregates/stock.aggregate';
import { StockReservation } from '../../../domain/entities/stock-reservation.entity';
import { IStockRepository } from '../../../domain/interfaces/stock-repository.interface';
import { CacheService } from '../../cache/redis/cache.service';
import { StockRepository } from '../repositories/stock.repository';

@Injectable()
export class CachedStockRepository implements IStockRepository {
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly cache: CacheService,
  ) {}

  async findById(id: string): Promise<Stock | null> {
    return this.stockRepository.findById(id);
  }

  async findBySku(sku: string, warehouseId: string): Promise<Stock | null> {
    const cached = await this.cache.getStock(sku, warehouseId);
    if (cached) return cached;

    const stock = await this.stockRepository.findBySku(sku, warehouseId);
    if (stock) {
      await this.cache.setStock(stock);
    }
    return stock;
  }

  async findByWarehouse(warehouseId: string): Promise<Stock[]> {
    const cached = await this.cache.getWarehouseStocks(warehouseId);
    if (cached) return cached;

    const stocks = await this.stockRepository.findByWarehouse(warehouseId);
    await this.cache.setWarehouseStocks(warehouseId, stocks);
    return stocks;
  }

  async findLowStock(warehouseId?: string): Promise<Stock[]> {
    if (!warehouseId) {
      const cached = await this.cache.getLowStockAlerts();
      if (cached) return cached;
    }

    const stocks = await this.stockRepository.findLowStock(warehouseId);
    if (!warehouseId) {
      await this.cache.setLowStockAlerts(stocks);
    }
    return stocks;
  }

  async save(stock: Stock): Promise<void> {
    await this.stockRepository.save(stock);
    await this.invalidateCache(stock);
  }

  async updateWithVersion(stock: Stock, expectedVersion: number): Promise<boolean> {
    const updated = await this.stockRepository.updateWithVersion(stock, expectedVersion);
    if (updated) {
      await this.invalidateCache(stock);
    }
    return updated;
  }

  async saveReservation(reservation: StockReservation): Promise<void> {
    await this.stockRepository.saveReservation(reservation);
  }

  async findReservation(orderId: string): Promise<StockReservation | null> {
    return this.stockRepository.findReservation(orderId);
  }

  async findExpiredReservations(): Promise<StockReservation[]> {
    return this.stockRepository.findExpiredReservations();
  }

  private async invalidateCache(stock: Stock): Promise<void> {
    await this.cache.invalidateStock(stock.sku, stock.warehouseId);
    await this.cache.invalidateWarehouse(stock.warehouseId);
    await this.cache.invalidateLowStockAlerts();
  }
}
