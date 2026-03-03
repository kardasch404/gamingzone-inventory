import { Injectable } from '@nestjs/common';
import { Registry, Gauge, Counter, Histogram } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly registry: Registry;
  private readonly stockLevelGauge: Gauge;
  private readonly activeReservationsGauge: Gauge;
  private readonly expiredReservationsCounter: Counter;
  private readonly lowStockAlertsCounter: Counter;
  private readonly stockOperationsCounter: Counter;
  private readonly apiRequestsCounter: Counter;
  private readonly apiResponseTimeHistogram: Histogram;

  constructor() {
    this.registry = new Registry();

    this.stockLevelGauge = new Gauge({
      name: 'inventory_stock_level_gauge',
      help: 'Current stock level by SKU and warehouse',
      labelNames: ['sku', 'warehouse'],
      registers: [this.registry],
    });

    this.activeReservationsGauge = new Gauge({
      name: 'inventory_reservations_active_gauge',
      help: 'Number of active reservations',
      registers: [this.registry],
    });

    this.expiredReservationsCounter = new Counter({
      name: 'inventory_reservations_expired_total',
      help: 'Total number of expired reservations',
      registers: [this.registry],
    });

    this.lowStockAlertsCounter = new Counter({
      name: 'inventory_low_stock_alerts_total',
      help: 'Total number of low stock alerts',
      labelNames: ['severity'],
      registers: [this.registry],
    });

    this.stockOperationsCounter = new Counter({
      name: 'inventory_stock_operations_total',
      help: 'Total number of stock operations',
      labelNames: ['type'],
      registers: [this.registry],
    });

    this.apiRequestsCounter = new Counter({
      name: 'inventory_api_requests_total',
      help: 'Total API requests',
      labelNames: ['endpoint', 'status'],
      registers: [this.registry],
    });

    this.apiResponseTimeHistogram = new Histogram({
      name: 'inventory_api_response_time_seconds',
      help: 'API response time in seconds',
      labelNames: ['endpoint'],
      registers: [this.registry],
    });
  }

  setStockLevel(sku: string, warehouse: string, level: number): void {
    this.stockLevelGauge.set({ sku, warehouse }, level);
  }

  setActiveReservations(count: number): void {
    this.activeReservationsGauge.set(count);
  }

  incrementExpiredReservations(): void {
    this.expiredReservationsCounter.inc();
  }

  incrementLowStockAlert(severity: 'WARNING' | 'CRITICAL'): void {
    this.lowStockAlertsCounter.inc({ severity });
  }

  incrementStockOperation(type: string): void {
    this.stockOperationsCounter.inc({ type });
  }

  incrementApiRequest(endpoint: string, status: number): void {
    this.apiRequestsCounter.inc({ endpoint, status });
  }

  observeResponseTime(endpoint: string, duration: number): void {
    this.apiResponseTimeHistogram.observe({ endpoint }, duration);
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
