import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class IdempotencyService {
  constructor(private readonly prisma: PrismaService) {}

  async isEventProcessed(eventId: string): Promise<boolean> {
    const event = await this.prisma.processedEvent.findUnique({
      where: { eventId },
    });
    return !!event;
  }

  async markEventProcessed(eventId: string, eventType: string): Promise<void> {
    await this.prisma.processedEvent.create({
      data: { eventId, eventType },
    });
  }
}
