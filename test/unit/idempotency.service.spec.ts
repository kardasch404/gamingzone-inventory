import { IdempotencyService } from '../../src/infrastructure/messaging/kafka/idempotency.service';

describe('IdempotencyService', () => {
  let service: IdempotencyService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      processedEvent: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    service = new IdempotencyService(prisma);
  });

  it('should return true if event already processed', async () => {
    jest.spyOn(prisma.processedEvent, 'findUnique').mockResolvedValue({
      eventId: 'evt-1',
      eventType: 'order.created',
      processedAt: new Date(),
    });

    const result = await service.isEventProcessed('evt-1');

    expect(result).toBe(true);
  });

  it('should return false if event not processed', async () => {
    jest.spyOn(prisma.processedEvent, 'findUnique').mockResolvedValue(null);

    const result = await service.isEventProcessed('evt-1');

    expect(result).toBe(false);
  });

  it('should mark event as processed', async () => {
    await service.markEventProcessed('evt-1', 'order.created');

    expect(prisma.processedEvent.create).toHaveBeenCalledWith({
      data: { eventId: 'evt-1', eventType: 'order.created' },
    });
  });
});
