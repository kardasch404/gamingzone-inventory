import { CacheService } from '../../src/infrastructure/cache/redis/cache.service';
import { RedisService } from '../../src/infrastructure/cache/redis/redis.service';
import { Stock } from '../../src/domain/aggregates/stock.aggregate';

describe('CacheService', () => {
  let cacheService: CacheService;
  let redisService: RedisService;

  beforeEach(() => {
    redisService = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      delPattern: jest.fn(),
      publish: jest.fn(),
      subscribe: jest.fn(),
    } as any;

    cacheService = new CacheService(redisService);
  });

  describe('getStock', () => {
    it('should return cached stock', async () => {
      const stock = Stock.create('1', 'SKU-001', 'wh-1');
      jest.spyOn(redisService, 'get').mockResolvedValue(JSON.stringify(stock));

      const result = await cacheService.getStock('SKU-001', 'wh-1');

      expect(result).toBeDefined();
      expect(redisService.get).toHaveBeenCalledWith('stock:sku:SKU-001:warehouse:wh-1');
    });

    it('should return null when not cached', async () => {
      jest.spyOn(redisService, 'get').mockResolvedValue(null);

      const result = await cacheService.getStock('SKU-001', 'wh-1');

      expect(result).toBeNull();
    });
  });

  describe('setStock', () => {
    it('should cache stock with TTL', async () => {
      const stock = Stock.create('1', 'SKU-001', 'wh-1');

      await cacheService.setStock(stock);

      expect(redisService.set).toHaveBeenCalledWith(
        'stock:sku:SKU-001:warehouse:wh-1',
        JSON.stringify(stock),
        300,
      );
    });
  });

  describe('invalidateStock', () => {
    it('should delete cache and publish invalidation', async () => {
      await cacheService.invalidateStock('SKU-001', 'wh-1');

      expect(redisService.del).toHaveBeenCalledWith('stock:sku:SKU-001:warehouse:wh-1');
      expect(redisService.publish).toHaveBeenCalledWith(
        'cache:invalidate',
        expect.stringContaining('SKU-001'),
      );
    });
  });

  describe('invalidateWarehouse', () => {
    it('should delete warehouse cache pattern', async () => {
      await cacheService.invalidateWarehouse('wh-1');

      expect(redisService.delPattern).toHaveBeenCalledWith('stock:warehouse:wh-1*');
      expect(redisService.publish).toHaveBeenCalled();
    });
  });
});
