import { AddStockUseCase } from '../../src/application/use-cases/commands/add-stock.use-case';
import { Stock } from '../../src/domain/aggregates/stock.aggregate';

describe('AddStockUseCase', () => {
  let useCase: AddStockUseCase;
  let stockRepository: any;

  beforeEach(() => {
    stockRepository = {
      findBySku: jest.fn(),
      updateWithVersion: jest.fn(),
    };

    useCase = new AddStockUseCase(stockRepository);
  });

  it('should add stock successfully', async () => {
    const stock = Stock.create('1', 'SKU-001', 'wh-1');
    stock.addStock(50, 'Initial');
    stock.clearEvents();

    jest.spyOn(stockRepository, 'findBySku').mockResolvedValue(stock);
    jest.spyOn(stockRepository, 'updateWithVersion').mockResolvedValue(true);

    await useCase.execute({
      sku: 'SKU-001',
      warehouseId: 'wh-1',
      quantity: 50,
      reason: 'Restock',
    });

    expect(stock.quantity).toBe(100);
    expect(stockRepository.updateWithVersion).toHaveBeenCalled();
  });

  it('should throw error when stock not found', async () => {
    jest.spyOn(stockRepository, 'findBySku').mockResolvedValue(null);

    await expect(
      useCase.execute({
        sku: 'SKU-999',
        warehouseId: 'wh-1',
        quantity: 50,
        reason: 'Restock',
      }),
    ).rejects.toThrow('Stock not found');
  });
});
