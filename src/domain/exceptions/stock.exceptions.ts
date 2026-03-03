export class InsufficientStockException extends Error {
  constructor(sku: string, requested: number, available: number) {
    super(`Insufficient stock for SKU ${sku}. Requested: ${requested}, Available: ${available}`);
    this.name = 'InsufficientStockException';
  }
}

export class StockCapacityExceededException extends Error {
  constructor(sku: string, capacity: number) {
    super(`Stock capacity exceeded for SKU ${sku}. Max capacity: ${capacity}`);
    this.name = 'StockCapacityExceededException';
  }
}

export class NegativeStockException extends Error {
  constructor(sku: string) {
    super(`Stock cannot be negative for SKU ${sku}`);
    this.name = 'NegativeStockException';
  }
}

export class ReservationExpiredException extends Error {
  constructor(orderId: string) {
    super(`Reservation expired for order ${orderId}`);
    this.name = 'ReservationExpiredException';
  }
}

export class ConcurrentUpdateException extends Error {
  constructor(sku: string) {
    super(`Concurrent update detected for SKU ${sku}. Please retry.`);
    this.name = 'ConcurrentUpdateException';
  }
}
