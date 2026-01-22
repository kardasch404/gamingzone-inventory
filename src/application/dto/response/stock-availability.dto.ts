export class StockAvailabilityDTO {
  constructor(
    public readonly sku: string,
    public readonly available: number,
    public readonly isAvailable: boolean,
    public readonly requested: number,
  ) {}
}
