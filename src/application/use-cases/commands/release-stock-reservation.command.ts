export class ReleaseStockReservationCommand {
  constructor(
    public readonly orderId: string,
    public readonly reason?: string,
  ) {}
}
