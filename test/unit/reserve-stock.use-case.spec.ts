import { ReserveStockUseCase } from '../../src/application/use-cases/commands/reserve-stock.use-case';
import { Stock } from '../../src/domain/aggregates/stock.aggregate';
import { InsufficientStockException } from '../../src/domain/exceptions/stock.exceptions';

describe('ReserveStockUseCase', () => {
  let useCase: ReserveStockUseCase;
  let stockRepository: any;

  beforeEach(() => {
    stockRepository = {
      findBySku: jest.fn(),
      updateWithVersion: jest.fn(),
      saveReservation: jest.fn(),
    };

    useCase = new ReserveStockUseCase(stockRepository);
  });

  it('should reserve stock successfully', async () => {
    const stock = Stock.create('1', 'SKU-001', 'wh-1');
    stock.addStock(100, 'Initial');
    stock.clearEvents();

    jest.spyOn(stockRepository, 'findBySku').mockResolvedValue(stock);
    jest.spyOn(stockRepository, 'updateWithVersion').mockResolvedValue(true);

    const result = await useCase.execute({
      sku: 'SKU-001',
      warehouseId: 'wh-1',
      quantity: 10,
      orderId: 'order-1',
    });

    expect(result.orderId).toBe('order-1');
    expect(result.quantity).toBe(10);
    expect(stockRepository.updateWithVersion).toHaveBeenCalled();
    expect(stockRepository.saveReservation).toHaveBeenCalled();
  });

  it('should throw error when stock not found', async () => {
    jest.spyOn(stockRepository, 'findBySku').mockResolvedValue(null);

    await expect(
      useCase.execute({
        sku: 'SKU-999',
        warehouseId: 'wh-1',
        quantity: 10,
        orderId: 'order-1',
      }),
    ).rejects.toThrow('Stock not found');
  });

  it('should throw error when insufficient stock', async () => {
    const stock = Stock.create('1', 'SKU-001', 'wh-1');
    stock.addStock(5, 'Initial');

    jest.spyOn(stockRepository, 'findBySku').mockResolvedValue(stock);

    await expect(
      useCase.execute({
        sku: 'SKU-001',
        warehouseId: 'wh-1',
        quantity: 10,
        orderId: 'order-1',
      }),
    ).rejects.toThrow(InsufficientStockException);
  });
});
