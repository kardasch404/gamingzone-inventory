import { Injectable } from '@nestjs/common';
import { AppLogger } from '../../shared/utils/logger.util';

export interface AuditLog {
  action: string;
  resource: string;
  resourceId: string;
  userId?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

@Injectable()
export class AuditLogger {
  private readonly logger = new AppLogger('AuditLogger');

  logStockReserved(data: {
    sku: string;
    quantity: number;
    orderId: string;
    userId?: string;
  }): void {
    this.log({
      action: 'STOCK_RESERVED',
      resource: 'stock',
      resourceId: data.sku,
      userId: data.userId,
      metadata: { quantity: data.quantity, orderId: data.orderId },
      timestamp: new Date(),
    });
  }

  logStockDeducted(data: {
    sku: string;
    quantity: number;
    orderId: string;
    userId?: string;
  }): void {
    this.log({
      action: 'STOCK_DEDUCTED',
      resource: 'stock',
      resourceId: data.sku,
      userId: data.userId,
      metadata: { quantity: data.quantity, orderId: data.orderId },
      timestamp: new Date(),
    });
  }

  logStockAdded(data: {
    sku: string;
    quantity: number;
    reason: string;
    userId?: string;
  }): void {
    this.log({
      action: 'STOCK_ADDED',
      resource: 'stock',
      resourceId: data.sku,
      userId: data.userId,
      metadata: { quantity: data.quantity, reason: data.reason },
      timestamp: new Date(),
    });
  }

  logStockAdjusted(data: {
    sku: string;
    oldQuantity: number;
    newQuantity: number;
    reason: string;
    userId?: string;
  }): void {
    this.log({
      action: 'STOCK_ADJUSTED',
      resource: 'stock',
      resourceId: data.sku,
      userId: data.userId,
      metadata: {
        oldQuantity: data.oldQuantity,
        newQuantity: data.newQuantity,
        reason: data.reason,
      },
      timestamp: new Date(),
    });
  }

  private log(auditLog: AuditLog): void {
    this.logger.log(
      `[AUDIT] ${auditLog.action} - ${auditLog.resource}:${auditLog.resourceId} by ${auditLog.userId || 'system'}`,
    );
  }
}
