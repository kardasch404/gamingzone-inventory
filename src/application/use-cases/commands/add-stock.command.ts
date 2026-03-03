export class AddStockCommand {
  constructor(
    public readonly sku: string,
    public readonly warehouseId: string,
    public readonly quantity: number,
    public readonly reason: string,
    public readonly performedBy?: string,
  ) {}
}
