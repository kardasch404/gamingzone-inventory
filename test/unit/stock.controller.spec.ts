import { StockController } from '../../src/presentation/rest/controllers/stock.controller';

describe('StockController', () => {
  let controller: StockController;
  let checkAvailabilityHandler: any;
  let addStockUseCase: any;
  let adjustStockUseCase: any;
  let getLowStockAlertsHandler: any;

  beforeEach(() => {
    checkAvailabilityHandler = { execute: jest.fn() };
    addStockUseCase = { execute: jest.fn() };
    adjustStockUseCase = { execute: jest.fn() };
    getLowStockAlertsHandler = { execute: jest.fn() };

    controller = new StockController(
      checkAvailabilityHandler,
      addStockUseCase,
      adjustStockUseCase,
      getLowStockAlertsHandler,
    );
  });

  describe('checkAvailability', () => {
    it('should check stock availability', async () => {
      const mockResult = {
        sku: 'SKU-001',
        available: 100,
        isAvailable: true,
        requested: 10,
      };

      jest.spyOn(checkAvailabilityHandler, 'execute').mockResolvedValue(mockResult);

      const result = await controller.checkAvailability('SKU-001', { quantity: 10 });

      expect(result).toEqual(mockResult);
      expect(checkAvailabilityHandler.execute).toHaveBeenCalledWith({
        sku: 'SKU-001',
        warehouseId: 'primary',
        quantity: 10,
      });
    });
  });

  describe('addStock', () => {
    it('should add stock successfully', async () => {
      const result = await controller.addStock('SKU-001', {
        quantity: 50,
        reason: 'Restock',
      });

      expect(result).toEqual({ message: 'Stock added successfully' });
      expect(addStockUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('adjustStock', () => {
    it('should adjust stock successfully', async () => {
      const result = await controller.adjustStock('SKU-001', {
        newQuantity: 100,
        reason: 'Manual correction',
      });

      expect(result).toEqual({ message: 'Stock adjusted successfully' });
      expect(adjustStockUseCase.execute).toHaveBeenCalled();
    });
  });
});
