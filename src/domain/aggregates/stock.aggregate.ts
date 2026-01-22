import { AggregateRoot } from './aggregate-root';

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
}
