import { MetricsService } from '../../src/infrastructure/monitoring/metrics.service';

describe('MetricsService', () => {
  let service: MetricsService;

  beforeEach(() => {
    service = new MetricsService();
  });

  it('should set stock level', () => {
    expect(() => {
      service.setStockLevel('SKU-001', 'primary', 100);
    }).not.toThrow();
  });

  it('should increment stock operations', () => {
    expect(() => {
      service.incrementStockOperation('reserve');
      service.incrementStockOperation('deduct');
    }).not.toThrow();
  });

  it('should increment low stock alerts', () => {
    expect(() => {
      service.incrementLowStockAlert('WARNING');
      service.incrementLowStockAlert('CRITICAL');
    }).not.toThrow();
  });

  it('should get metrics', async () => {
    service.setStockLevel('SKU-001', 'primary', 50);
    service.incrementStockOperation('reserve');

    const metrics = await service.getMetrics();

    expect(metrics).toContain('inventory_stock_level_gauge');
    expect(metrics).toContain('inventory_stock_operations_total');
  });
});
