export interface OrderCreatedEvent {
  eventId: string;
  eventType: 'order.created';
  timestamp: string;
  data: {
    orderId: string;
    customerId: string;
    items: Array<{
      sku: string;
      quantity: number;
      price: number;
    }>;
  };
}

export interface OrderCancelledEvent {
  eventId: string;
  eventType: 'order.cancelled';
  timestamp: string;
  data: {
    orderId: string;
    reason: string;
  };
}

export interface PaymentSucceededEvent {
  eventId: string;
  eventType: 'payment.succeeded';
  timestamp: string;
  data: {
    orderId: string;
    paymentId: string;
    amount: number;
  };
}

export interface PaymentFailedEvent {
  eventId: string;
  eventType: 'payment.failed';
  timestamp: string;
  data: {
    orderId: string;
    reason: string;
  };
}
