export class AdjustStockCommand {
  constructor(
    public readonly sku: string,
    public readonly warehouseId: string,
    public readonly newQuantity: number,
    public readonly reason: string,
    public readonly performedBy: string,
  ) {}
}
