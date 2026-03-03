import { DomainEvent } from './domain-event.interface';

export class StockReservedEvent implements DomainEvent {
  readonly eventName = 'StockReserved';
  readonly occurredOn: Date;

  constructor(
    public readonly stockId: string,
    public readonly sku: string,
    public readonly orderId: string,
    public readonly quantity: number,
  ) {
    this.occurredOn = new Date();
  }
}

export class StockReservationReleasedEvent implements DomainEvent {
  readonly eventName = 'StockReservationReleased';
  readonly occurredOn: Date;

  constructor(
    public readonly stockId: string,
    public readonly orderId: string,
    public readonly quantity: number,
  ) {
    this.occurredOn = new Date();
  }
}

export class StockReservationExpiredEvent implements DomainEvent {
  readonly eventName = 'StockReservationExpired';
  readonly occurredOn: Date;

  constructor(
    public readonly stockId: string,
    public readonly orderId: string,
    public readonly quantity: number,
  ) {
    this.occurredOn = new Date();
  }
}

export class StockDeductedEvent implements DomainEvent {
  readonly eventName = 'StockDeducted';
  readonly occurredOn: Date;

  constructor(
    public readonly stockId: string,
    public readonly sku: string,
    public readonly quantity: number,
    public readonly reason: string,
  ) {
    this.occurredOn = new Date();
  }
}

export class StockAddedEvent implements DomainEvent {
  readonly eventName = 'StockAdded';
  readonly occurredOn: Date;

  constructor(
    public readonly stockId: string,
    public readonly sku: string,
    public readonly quantity: number,
    public readonly reason: string,
  ) {
    this.occurredOn = new Date();
  }
}

export class LowStockAlertEvent implements DomainEvent {
  readonly eventName = 'LowStockAlert';
  readonly occurredOn: Date;

  constructor(
    public readonly stockId: string,
    public readonly sku: string,
    public readonly currentQuantity: number,
    public readonly threshold: number,
  ) {
    this.occurredOn = new Date();
  }
}

export class OutOfStockAlertEvent implements DomainEvent {
  readonly eventName = 'OutOfStockAlert';
  readonly occurredOn: Date;

  constructor(
    public readonly stockId: string,
    public readonly sku: string,
  ) {
    this.occurredOn = new Date();
  }
}
