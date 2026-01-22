import { Injectable } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service';
import {
  StockReservedEvent,
  StockDeductedEvent,
  StockReleasedEvent,
  LowStockAlertEvent,
  OutOfStockEvent,
  StockAddedEvent,
} from './stock-event.schemas';

@Injectable()
export class EventPublisher {
  constructor(private readonly kafkaService: KafkaService) {}

  async publishStockReserved(data: StockReservedEvent['data']): Promise<void> {
    const event: StockReservedEvent = {
      eventType: 'stock.reserved',
      version: '1.0',
      timestamp: new Date().toISOString(),
      data,
    };
    await this.kafkaService.publish('gamingzone.inventory.stock-events', event);
  }

  async publishStockDeducted(data: StockDeductedEvent['data']): Promise<void> {
    const event: StockDeductedEvent = {
      eventType: 'stock.deducted',
      version: '1.0',
      timestamp: new Date().toISOString(),
      data,
    };
    await this.kafkaService.publish('gamingzone.inventory.stock-events', event);
  }

  async publishStockReleased(data: StockReleasedEvent['data']): Promise<void> {
    const event: StockReleasedEvent = {
      eventType: 'stock.released',
      version: '1.0',
      timestamp: new Date().toISOString(),
      data,
    };
    await this.kafkaService.publish('gamingzone.inventory.stock-events', event);
  }

  async publishLowStockAlert(data: LowStockAlertEvent['data']): Promise<void> {
    const event: LowStockAlertEvent = {
      eventType: 'stock.low_alert',
      version: '1.0',
      timestamp: new Date().toISOString(),
      data,
    };
    await this.kafkaService.publish('gamingzone.inventory.alert-events', event);
  }

  async publishOutOfStock(data: OutOfStockEvent['data']): Promise<void> {
    const event: OutOfStockEvent = {
      eventType: 'stock.out_of_stock',
      version: '1.0',
      timestamp: new Date().toISOString(),
      data,
    };
    await this.kafkaService.publish('gamingzone.inventory.alert-events', event);
  }

  async publishStockAdded(data: StockAddedEvent['data']): Promise<void> {
    const event: StockAddedEvent = {
      eventType: 'stock.added',
      version: '1.0',
      timestamp: new Date().toISOString(),
      data,
    };
    await this.kafkaService.publish('gamingzone.inventory.stock-events', event);
  }
}
