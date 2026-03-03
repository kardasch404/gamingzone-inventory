import { Stock } from '../../src/domain/aggregates/stock.aggregate';
import {
  InsufficientStockException,
  NegativeStockException,
  StockCapacityExceededException,
} from '../../src/domain/exceptions/stock.exceptions';

describe('Stock Aggregate', () => {
  let stock: Stock;

  beforeEach(() => {
    stock = Stock.create('stock-1', 'SKU-001', 'warehouse-1', 5, 100);
  });

  describe('addStock', () => {
    it('should add stock and emit event', () => {
      stock.addStock(10, 'Purchase');

      expect(stock.quantity).toBe(10);
      expect(stock.available).toBe(10);
      expect(stock.domainEvents).toHaveLength(1);
      expect(stock.domainEvents[0].eventName).toBe('StockAdded');
    });

    it('should throw error when exceeding capacity', () => {
      expect(() => stock.addStock(150, 'Purchase')).toThrow(
        StockCapacityExceededException,
      );
    });
  });

  describe('reserve', () => {
    beforeEach(() => {
      stock.addStock(20, 'Initial');
      stock.clearEvents();
    });

    it('should reserve stock successfully', () => {
      stock.reserve(5, 'order-1');

      expect(stock.reserved).toBe(5);
      expect(stock.available).toBe(15);
      expect(stock.domainEvents[0].eventName).toBe('StockReserved');
    });

    it('should throw error when insufficient stock', () => {
      expect(() => stock.reserve(25, 'order-1')).toThrow(
        InsufficientStockException,
      );
    });

    it('should emit low stock alert', () => {
      stock.reserve(16, 'order-1');

      const events = stock.domainEvents.map((e) => e.eventName);
      expect(events).toContain('LowStockAlert');
    });
  });

  describe('deductStock', () => {
    beforeEach(() => {
      stock.addStock(10, 'Initial');
      stock.clearEvents();
    });

    it('should deduct stock successfully', () => {
      stock.deductStock(5, 'Sale');

      expect(stock.quantity).toBe(5);
      expect(stock.available).toBe(5);
      expect(stock.domainEvents[0].eventName).toBe('StockDeducted');
    });

    it('should throw error when stock goes negative', () => {
      expect(() => stock.deductStock(15, 'Sale')).toThrow(
        NegativeStockException,
      );
    });

    it('should emit out of stock alert', () => {
      stock.deductStock(10, 'Sale');

      const events = stock.domainEvents.map((e) => e.eventName);
      expect(events).toContain('OutOfStockAlert');
    });
  });

  describe('releaseReservation', () => {
    beforeEach(() => {
      stock.addStock(20, 'Initial');
      stock.reserve(10, 'order-1');
      stock.clearEvents();
    });

    it('should release reservation', () => {
      stock.releaseReservation(10, 'order-1');

      expect(stock.reserved).toBe(0);
      expect(stock.available).toBe(20);
      expect(stock.domainEvents[0].eventName).toBe('StockReservationReleased');
    });
  });

  describe('fulfillReservation', () => {
    beforeEach(() => {
      stock.addStock(20, 'Initial');
      stock.reserve(10, 'order-1');
      stock.clearEvents();
    });

    it('should fulfill reservation', () => {
      stock.fulfillReservation(10);

      expect(stock.quantity).toBe(10);
      expect(stock.reserved).toBe(0);
      expect(stock.available).toBe(10);
    });
  });
});
