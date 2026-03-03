import { Injectable } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { AppLogger } from '../../../shared/utils/logger.util';

@Injectable()
export class DLQService {
  private readonly logger = new AppLogger('DLQService');

  constructor(private readonly kafkaService: KafkaService) {}

  async sendToDLQ(event: any, error: Error): Promise<void> {
    const dlqMessage = {
      originalEvent: event,
      error: {
        message: error.message,
        stack: error.stack,
      },
      timestamp: new Date().toISOString(),
    };

    try {
      await this.kafkaService.publish('inventory.dlq', dlqMessage);
      this.logger.log(`Event sent to DLQ: ${event.eventId}`);
    } catch (dlqError) {
      this.logger.error('Failed to send to DLQ', dlqError);
    }
  }
}
