import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { CacheService } from './cache.service';

@Global()
@Module({
  providers: [RedisService, CacheService],
  exports: [RedisService, CacheService],
})
export class RedisModule {}
