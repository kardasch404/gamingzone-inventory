export class ReserveStockCommand {
  constructor(
    public readonly sku: string,
    public readonly warehouseId: string,
    public readonly quantity: number,
    public readonly orderId: string,
  ) {}
}
