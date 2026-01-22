import { StockRepository } from '../../src/infrastructure/database/repositories/stock.repository';
import { PrismaService } from '../../src/infrastructure/database/prisma/prisma.service';
import { Stock } from '../../src/domain/aggregates/stock.aggregate';

describe('StockRepository', () => {
  let repository: StockRepository;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = {
      stock: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        updateMany: jest.fn(),
        fields: { minThreshold: 5 },
      },
      stockReservation: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
      },
    } as any;

    repository = new StockRepository(prisma);
  });

  describe('findBySku', () => {
    it('should find stock by SKU and warehouse', async () => {
      const mockStock = {
        id: '1',
        sku: 'SKU-001',
        warehouseId: 'wh-1',
        quantity: 100,
        reserved: 10,
        available: 90,
        minThreshold: 5,
        maxCapacity: null,
        version: 0,
        lastStockAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.stock, 'findUnique').mockResolvedValue(mockStock);

      const result = await repository.findBySku('SKU-001', 'wh-1');

      expect(result).toBeInstanceOf(Stock);
      expect(result?.sku).toBe('SKU-001');
      expect(prisma.stock.findUnique).toHaveBeenCalledWith({
        where: { sku_warehouseId: { sku: 'SKU-001', warehouseId: 'wh-1' } },
      });
    });

    it('should return null when not found', async () => {
      jest.spyOn(prisma.stock, 'findUnique').mockResolvedValue(null);

      const result = await repository.findBySku('SKU-999', 'wh-1');

      expect(result).toBeNull();
    });
  });

  describe('updateWithVersion', () => {
    it('should update with optimistic locking', async () => {
      const stock = Stock.create('1', 'SKU-001', 'wh-1');
      stock.quantity = 100;

      jest.spyOn(prisma.stock, 'updateMany').mockResolvedValue({ count: 1 });

      const result = await repository.updateWithVersion(stock, 0);

      expect(result).toBe(true);
      expect(prisma.stock.updateMany).toHaveBeenCalledWith({
        where: { id: '1', version: 0 },
        data: expect.objectContaining({ version: 1 }),
      });
    });

    it('should return false on version mismatch', async () => {
      const stock = Stock.create('1', 'SKU-001', 'wh-1');

      jest.spyOn(prisma.stock, 'updateMany').mockResolvedValue({ count: 0 });

      const result = await repository.updateWithVersion(stock, 0);

      expect(result).toBe(false);
    });
  });

  describe('findExpiredReservations', () => {
    it('should find expired reservations', async () => {
      const mockReservations = [
        {
          id: '1',
          stockId: 'stock-1',
          orderId: 'order-1',
          quantity: 5,
          status: 'ACTIVE',
          reservedAt: new Date(),
          expiresAt: new Date(Date.now() - 1000),
          releasedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(prisma.stockReservation, 'findMany').mockResolvedValue(mockReservations);

      const result = await repository.findExpiredReservations();

      expect(result).toHaveLength(1);
      expect(prisma.stockReservation.findMany).toHaveBeenCalledWith({
        where: {
          status: 'ACTIVE',
          expiresAt: { lt: expect.any(Date) },
        },
      });
    });
  });
});
