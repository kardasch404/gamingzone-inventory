export interface StockReservedEvent {
  eventType: 'stock.reserved';
  version: '1.0';
  timestamp: string;
  data: {
    reservationId: string;
    sku: string;
    quantity: number;
    orderId: string;
    warehouseId: string;
    expiresAt: string;
  };
}

export interface StockDeductedEvent {
  eventType: 'stock.deducted';
  version: '1.0';
  timestamp: string;
  data: {
    sku: string;
    quantity: number;
    orderId: string;
    remainingStock: number;
  };
}

export interface StockReleasedEvent {
  eventType: 'stock.released';
  version: '1.0';
  timestamp: string;
  data: {
    sku: string;
    quantity: number;
    orderId: string;
    reason: string;
  };
}

export interface LowStockAlertEvent {
  eventType: 'stock.low_alert';
  version: '1.0';
  timestamp: string;
  data: {
    sku: string;
    currentQuantity: number;
    threshold: number;
    warehouseId: string;
    severity: 'WARNING' | 'CRITICAL';
  };
}

export interface OutOfStockEvent {
  eventType: 'stock.out_of_stock';
  version: '1.0';
  timestamp: string;
  data: {
    sku: string;
    warehouseId: string;
  };
}

export interface StockAddedEvent {
  eventType: 'stock.added';
  version: '1.0';
  timestamp: string;
  data: {
    sku: string;
    quantity: number;
    reason: string;
    warehouseId: string;
  };
}
