import { Stock as PrismaStock } from '@prisma/client';
import { Stock } from '../../../domain/aggregates/stock.aggregate';

export class StockMapper {
  static toDomain(prismaStock: PrismaStock): Stock {
    return new Stock(
      prismaStock.id,
      prismaStock.sku,
      prismaStock.warehouseId,
      prismaStock.quantity,
      prismaStock.reserved,
      prismaStock.available,
      prismaStock.minThreshold,
      prismaStock.maxCapacity,
      prismaStock.version,
      prismaStock.lastStockAt,
      prismaStock.createdAt,
      prismaStock.updatedAt,
    );
  }

  static toPersistence(stock: Stock) {
    return {
      id: stock.id,
      sku: stock.sku,
      warehouseId: stock.warehouseId,
      quantity: stock.quantity,
      reserved: stock.reserved,
      available: stock.available,
      minThreshold: stock.minThreshold,
      maxCapacity: stock.maxCapacity,
      version: stock.version,
      lastStockAt: stock.lastStockAt,
      updatedAt: stock.updatedAt,
    };
  }
}
