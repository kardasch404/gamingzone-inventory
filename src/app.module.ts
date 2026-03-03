import { Module } from '@nestjs/common';
import { configModule } from './shared/config/app.config';
import { PrismaModule } from './infrastructure/database/prisma/prisma.module';

@Module({
  imports: [configModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
