import { DeductStockUseCase } from '../../src/application/use-cases/commands/deduct-stock.use-case';
import { Stock } from '../../src/domain/aggregates/stock.aggregate';
import { StockReservation, ReservationStatus } from '../../src/domain/entities/stock-reservation.entity';

describe('DeductStockUseCase', () => {
  let useCase: DeductStockUseCase;
  let stockRepository: any;

  beforeEach(() => {
    stockRepository = {
      findReservation: jest.fn(),
      findById: jest.fn(),
      updateWithVersion: jest.fn(),
    };

    useCase = new DeductStockUseCase(stockRepository);
  });

  it('should deduct stock after payment', async () => {
    const stock = Stock.create('stock-1', 'SKU-001', 'wh-1');
    stock.addStock(100, 'Initial');
    stock.reserve(10, 'order-1');
    stock.clearEvents();

    const reservation = StockReservation.create('res-1', 'stock-1', 'order-1', 10);

    jest.spyOn(stockRepository, 'findReservation').mockResolvedValue(reservation);
    jest.spyOn(stockRepository, 'findById').mockResolvedValue(stock);
    jest.spyOn(stockRepository, 'updateWithVersion').mockResolvedValue(true);

    await useCase.execute({ orderId: 'order-1' });

    expect(stock.quantity).toBe(90);
    expect(stock.reserved).toBe(0);
    expect(stockRepository.updateWithVersion).toHaveBeenCalled();
  });

  it('should throw error when reservation not found', async () => {
    jest.spyOn(stockRepository, 'findReservation').mockResolvedValue(null);

    await expect(useCase.execute({ orderId: 'order-999' })).rejects.toThrow(
      'Active reservation not found',
    );
  });

  it('should throw error when reservation not active', async () => {
    const reservation = StockReservation.create('res-1', 'stock-1', 'order-1', 10);
    reservation.release();

    jest.spyOn(stockRepository, 'findReservation').mockResolvedValue(reservation);

    await expect(useCase.execute({ orderId: 'order-1' })).rejects.toThrow(
      'Active reservation not found',
    );
  });
});
