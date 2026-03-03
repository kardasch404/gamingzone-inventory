import { AggregateRoot } from './aggregate-root';
import {
  InsufficientStockException,
  NegativeStockException,
  StockCapacityExceededException,
} from '../exceptions/stock.exceptions';
import {
  LowStockAlertEvent,
  OutOfStockAlertEvent,
  StockAddedEvent,
  StockDeductedEvent,
  StockReservationExpiredEvent,
  StockReservationReleasedEvent,
  StockReservedEvent,
} from '../events/stock.events';

export class Stock extends AggregateRoot {
  constructor(
    public readonly id: string,
    public readonly sku: string,
    public readonly warehouseId: string,
    public quantity: number,
    public reserved: number,
    public available: number,
    public readonly minThreshold: number,
    public readonly maxCapacity: number | null,
    public version: number,
    public lastStockAt: Date | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {
    super();
  }

  static create(
    id: string,
    sku: string,
    warehouseId: string,
    minThreshold: number = 5,
    maxCapacity: number | null = null,
  ): Stock {
    return new Stock(
      id,
      sku,
      warehouseId,
      0,
      0,
      0,
      minThreshold,
      maxCapacity,
      0,
      null,
      new Date(),
      new Date(),
    );
  }

  private recalculateAvailable(): void {
    this.available = this.quantity - this.reserved;
  }

  isLowStock(): boolean {
    return this.available <= this.minThreshold;
  }

  isOutOfStock(): boolean {
    return this.available <= 0;
  }

  hasCapacity(amount: number): boolean {
    if (!this.maxCapacity) return true;
    return this.quantity + amount <= this.maxCapacity;
  }

  addStock(amount: number, reason: string): void {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    if (!this.hasCapacity(amount)) {
      throw new StockCapacityExceededException(this.sku, this.maxCapacity!);
    }

    this.quantity += amount;
    this.recalculateAvailable();
    this.lastStockAt = new Date();
    this.updatedAt = new Date();

    this.addDomainEvent(new StockAddedEvent(this.id, this.sku, amount, reason));
  }

  deductStock(amount: number, reason: string): void {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    if (this.quantity < amount) {
      throw new NegativeStockException(this.sku);
    }

    this.quantity -= amount;
    this.recalculateAvailable();
    this.lastStockAt = new Date();
    this.updatedAt = new Date();

    this.addDomainEvent(new StockDeductedEvent(this.id, this.sku, amount, reason));

    if (this.isOutOfStock()) {
      this.addDomainEvent(new OutOfStockAlertEvent(this.id, this.sku));
    } else if (this.isLowStock()) {
      this.addDomainEvent(
        new LowStockAlertEvent(this.id, this.sku, this.available, this.minThreshold),
      );
    }
  }

  reserve(amount: number, orderId: string): void {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    if (this.available < amount) {
      throw new InsufficientStockException(this.sku, amount, this.available);
    }

    this.reserved += amount;
    this.recalculateAvailable();
    this.updatedAt = new Date();

    this.addDomainEvent(new StockReservedEvent(this.id, this.sku, orderId, amount));

    if (this.isLowStock()) {
      this.addDomainEvent(
        new LowStockAlertEvent(this.id, this.sku, this.available, this.minThreshold),
      );
    }
  }

  releaseReservation(amount: number, orderId: string): void {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    if (this.reserved < amount) {
      throw new Error('Cannot release more than reserved');
    }

    this.reserved -= amount;
    this.recalculateAvailable();
    this.updatedAt = new Date();

    this.addDomainEvent(
      new StockReservationReleasedEvent(this.id, orderId, amount),
    );
  }

  expireReservation(amount: number, orderId: string): void {
    this.reserved -= amount;
    this.recalculateAvailable();
    this.updatedAt = new Date();

    this.addDomainEvent(
      new StockReservationExpiredEvent(this.id, orderId, amount),
    );
  }

  fulfillReservation(amount: number): void {
    if (this.reserved < amount) {
      throw new Error('Cannot fulfill more than reserved');
    }

    this.reserved -= amount;
    this.quantity -= amount;
    this.recalculateAvailable();
    this.lastStockAt = new Date();
    this.updatedAt = new Date();
  }
}
