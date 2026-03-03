import { StockReservation } from '../../../domain/entities/stock-reservation.entity';

export class ReservationDTO {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly sku: string,
    public readonly quantity: number,
    public readonly expiresAt: Date,
  ) {}

  static fromDomain(reservation: StockReservation, sku: string): ReservationDTO {
    return new ReservationDTO(
      reservation.id,
      reservation.orderId,
      sku,
      reservation.quantity,
      reservation.expiresAt,
    );
  }
}
