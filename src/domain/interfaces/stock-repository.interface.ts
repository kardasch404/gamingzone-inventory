import { Stock } from '../aggregates/stock.aggregate';
import { StockReservation } from '../entities/stock-reservation.entity';

export interface IStockRepository {
  findById(id: string): Promise<Stock | null>;
  findBySku(sku: string, warehouseId: string): Promise<Stock | null>;
  findByWarehouse(warehouseId: string): Promise<Stock[]>;
  findLowStock(warehouseId?: string): Promise<Stock[]>;
  save(stock: Stock): Promise<void>;
  updateWithVersion(stock: Stock, expectedVersion: number): Promise<boolean>;
  saveReservation(reservation: StockReservation): Promise<void>;
  findReservation(orderId: string): Promise<StockReservation | null>;
  findExpiredReservations(): Promise<StockReservation[]>;
}
