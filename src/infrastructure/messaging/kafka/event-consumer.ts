import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { IdempotencyService } from './idempotency.service';
import { DLQService } from './dlq.service';
import { OrderCreatedEventHandler } from './handlers/order-created.handler';
import { OrderCancelledEventHandler } from './handlers/order-cancelled.handler';
import { PaymentSucceededEventHandler } from './handlers/payment-succeeded.handler';
import { PaymentFailedEventHandler } from './handlers/payment-failed.handler';

@Injectable()
export class EventConsumer implements OnModuleInit {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly idempotencyService: IdempotencyService,
    private readonly dlqService: DLQService,
    private readonly orderCreatedHandler: OrderCreatedEventHandler,
    private readonly orderCancelledHandler: OrderCancelledEventHandler,
    private readonly paymentSucceededHandler: PaymentSucceededEventHandler,
    private readonly paymentFailedHandler: PaymentFailedEventHandler,
  ) {}

  async onModuleInit() {
    await this.subscribeToEvents();
  }

  private async subscribeToEvents() {
    await this.kafkaService.subscribe('order.created', async (event) => {
      await this.processEvent(event, this.orderCreatedHandler.handle.bind(this.orderCreatedHandler));
    });

    await this.kafkaService.subscribe('order.cancelled', async (event) => {
      await this.processEvent(event, this.orderCancelledHandler.handle.bind(this.orderCancelledHandler));
    });

    await this.kafkaService.subscribe('payment.succeeded', async (event) => {
      await this.processEvent(event, this.paymentSucceededHandler.handle.bind(this.paymentSucceededHandler));
    });

    await this.kafkaService.subscribe('payment.failed', async (event) => {
      await this.processEvent(event, this.paymentFailedHandler.handle.bind(this.paymentFailedHandler));
    });
  }

  private async processEvent(event: any, handler: (event: any) => Promise<void>) {
    if (await this.idempotencyService.isEventProcessed(event.eventId)) {
      return;
    }

    try {
      await handler(event);
      await this.idempotencyService.markEventProcessed(event.eventId, event.eventType);
    } catch (error) {
      await this.dlqService.sendToDLQ(event, error as Error);
      throw error;
    }
  }
}
