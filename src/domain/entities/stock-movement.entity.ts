export enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
  ADJUSTMENT = 'ADJUSTMENT',
  RESERVED = 'RESERVED',
  RELEASED = 'RELEASED',
  DAMAGED = 'DAMAGED',
  RETURNED = 'RETURNED',
}

export class StockMovement {
  constructor(
    public readonly id: string,
    public readonly stockId: string,
    public readonly type: MovementType,
    public readonly quantity: number,
    public readonly beforeQty: number,
    public readonly afterQty: number,
    public readonly reason: string | null,
    public readonly referenceId: string | null,
    public readonly performedBy: string | null,
    public readonly notes: string | null,
    public readonly createdAt: Date,
  ) {}

  static create(
    id: string,
    stockId: string,
    type: MovementType,
    quantity: number,
    beforeQty: number,
    afterQty: number,
    reason?: string,
    referenceId?: string,
    performedBy?: string,
    notes?: string,
  ): StockMovement {
    return new StockMovement(
      id,
      stockId,
      type,
      quantity,
      beforeQty,
      afterQty,
      reason || null,
      referenceId || null,
      performedBy || null,
      notes || null,
      new Date(),
    );
  }
}
