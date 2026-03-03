import { EventPublisher } from '../../src/infrastructure/messaging/events/event-publisher.service';

describe('EventPublisher', () => {
  let publisher: EventPublisher;
  let kafkaService: any;

  beforeEach(() => {
    kafkaService = {
      publish: jest.fn(),
    };

    publisher = new EventPublisher(kafkaService);
  });

  it('should publish stock reserved event', async () => {
    await publisher.publishStockReserved({
      reservationId: 'res-1',
      sku: 'SKU-001',
      quantity: 10,
      orderId: 'order-1',
      warehouseId: 'primary',
      expiresAt: new Date().toISOString(),
    });

    expect(kafkaService.publish).toHaveBeenCalledWith(
      'gamingzone.inventory.stock-events',
      expect.objectContaining({
        eventType: 'stock.reserved',
        version: '1.0',
      }),
    );
  });

  it('should publish low stock alert', async () => {
    await publisher.publishLowStockAlert({
      sku: 'SKU-001',
      currentQuantity: 3,
      threshold: 5,
      warehouseId: 'primary',
      severity: 'WARNING',
    });

    expect(kafkaService.publish).toHaveBeenCalledWith(
      'gamingzone.inventory.alert-events',
      expect.objectContaining({
        eventType: 'stock.low_alert',
      }),
    );
  });
});
