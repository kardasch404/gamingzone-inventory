export enum ReservationStatus {
  ACTIVE = 'ACTIVE',
  FULFILLED = 'FULFILLED',
  RELEASED = 'RELEASED',
  EXPIRED = 'EXPIRED',
}

export class StockReservation {
  constructor(
    public readonly id: string,
    public readonly stockId: string,
    public readonly orderId: string,
    public readonly quantity: number,
    public status: ReservationStatus,
    public readonly reservedAt: Date,
    public readonly expiresAt: Date,
    public releasedAt: Date | null,
  ) {}

  static create(
    id: string,
    stockId: string,
    orderId: string,
    quantity: number,
    expirationMinutes: number = 30,
  ): StockReservation {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expirationMinutes * 60000);

    return new StockReservation(
      id,
      stockId,
      orderId,
      quantity,
      ReservationStatus.ACTIVE,
      now,
      expiresAt,
      null,
    );
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isActive(): boolean {
    return this.status === ReservationStatus.ACTIVE && !this.isExpired();
  }

  release(): void {
    this.status = ReservationStatus.RELEASED;
    this.releasedAt = new Date();
  }

  fulfill(): void {
    this.status = ReservationStatus.FULFILLED;
  }

  expire(): void {
    this.status = ReservationStatus.EXPIRED;
    this.releasedAt = new Date();
  }
}
