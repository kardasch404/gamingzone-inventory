import { Injectable } from '@nestjs/common';
import { Stock } from '../../../domain/aggregates/stock.aggregate';
import { StockReservation } from '../../../domain/entities/stock-reservation.entity';
import { IStockRepository } from '../../../domain/interfaces/stock-repository.interface';
import { PrismaService } from '../prisma/prisma.service';
import { StockMapper } from './stock.mapper';

@Injectable()
export class StockRepository implements IStockRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Stock | null> {
    const stock = await this.prisma.stock.findUnique({ where: { id } });
    return stock ? StockMapper.toDomain(stock) : null;
  }

  async findBySku(sku: string, warehouseId: string): Promise<Stock | null> {
    const stock = await this.prisma.stock.findUnique({
      where: { sku_warehouseId: { sku, warehouseId } },
    });
    return stock ? StockMapper.toDomain(stock) : null;
  }

  async findByWarehouse(warehouseId: string): Promise<Stock[]> {
    const stocks = await this.prisma.stock.findMany({ where: { warehouseId } });
    return stocks.map(StockMapper.toDomain);
  }

  async findLowStock(warehouseId?: string): Promise<Stock[]> {
    const stocks = await this.prisma.stock.findMany({
      where: {
        ...(warehouseId && { warehouseId }),
        available: { lte: this.prisma.stock.fields.minThreshold },
      },
    });
    return stocks.map(StockMapper.toDomain);
  }

  async save(stock: Stock): Promise<void> {
    await this.prisma.stock.create({
      data: StockMapper.toPersistence(stock),
    });
  }

  async updateWithVersion(stock: Stock, expectedVersion: number): Promise<boolean> {
    try {
      const result = await this.prisma.stock.updateMany({
        where: {
          id: stock.id,
          version: expectedVersion,
        },
        data: {
          ...StockMapper.toPersistence(stock),
          version: expectedVersion + 1,
        },
      });
      return result.count > 0;
    } catch {
      return false;
    }
  }

  async saveReservation(reservation: StockReservation): Promise<void> {
    await this.prisma.stockReservation.create({
      data: {
        id: reservation.id,
        stockId: reservation.stockId,
        orderId: reservation.orderId,
        quantity: reservation.quantity,
        status: reservation.status,
        reservedAt: reservation.reservedAt,
        expiresAt: reservation.expiresAt,
        releasedAt: reservation.releasedAt,
      },
    });
  }

  async findReservation(orderId: string): Promise<StockReservation | null> {
    const reservation = await this.prisma.stockReservation.findUnique({
      where: { orderId },
    });
    if (!reservation) return null;

    return new StockReservation(
      reservation.id,
      reservation.stockId,
      reservation.orderId,
      reservation.quantity,
      reservation.status as any,
      reservation.reservedAt,
      reservation.expiresAt,
      reservation.releasedAt,
    );
  }

  async findExpiredReservations(): Promise<StockReservation[]> {
    const reservations = await this.prisma.stockReservation.findMany({
      where: {
        status: 'ACTIVE',
        expiresAt: { lt: new Date() },
      },
    });

    return reservations.map(
      (r) =>
        new StockReservation(
          r.id,
          r.stockId,
          r.orderId,
          r.quantity,
          r.status as any,
          r.reservedAt,
          r.expiresAt,
          r.releasedAt,
        ),
    );
  }
}
