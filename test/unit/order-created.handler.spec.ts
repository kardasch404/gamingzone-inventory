import { OrderCreatedEventHandler } from '../../src/infrastructure/messaging/kafka/handlers/order-created.handler';
import { ReserveStockUseCase } from '../../src/application/use-cases/commands/reserve-stock.use-case';

describe('OrderCreatedEventHandler', () => {
  let handler: OrderCreatedEventHandler;
  let reserveStockUseCase: ReserveStockUseCase;

  beforeEach(() => {
    reserveStockUseCase = {
      execute: jest.fn(),
    } as any;

    handler = new OrderCreatedEventHandler(reserveStockUseCase);
  });

  it('should reserve stock for all items', async () => {
    const event = {
      eventId: 'evt-1',
      eventType: 'order.created' as const,
      timestamp: new Date().toISOString(),
      data: {
        orderId: 'order-1',
        customerId: 'cust-1',
        items: [
          { sku: 'SKU-001', quantity: 2, price: 100 },
          { sku: 'SKU-002', quantity: 1, price: 50 },
        ],
      },
    };

    await handler.handle(event);

    expect(reserveStockUseCase.execute).toHaveBeenCalledTimes(2);
    expect(reserveStockUseCase.execute).toHaveBeenCalledWith({
      sku: 'SKU-001',
      warehouseId: 'primary',
      quantity: 2,
      orderId: 'order-1',
    });
  });

  it('should throw error when reservation fails', async () => {
    const event = {
      eventId: 'evt-1',
      eventType: 'order.created' as const,
      timestamp: new Date().toISOString(),
      data: {
        orderId: 'order-1',
        customerId: 'cust-1',
        items: [{ sku: 'SKU-001', quantity: 2, price: 100 }],
      },
    };

    jest.spyOn(reserveStockUseCase, 'execute').mockRejectedValue(new Error('Insufficient stock'));

    await expect(handler.handle(event)).rejects.toThrow('Insufficient stock');
  });
});
