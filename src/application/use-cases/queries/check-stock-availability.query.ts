export class CheckStockAvailabilityQuery {
  constructor(
    public readonly sku: string,
    public readonly warehouseId: string,
    public readonly quantity: number,
  ) {}
}
