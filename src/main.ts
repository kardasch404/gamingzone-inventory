import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppLogger } from './shared/utils/logger.util';
import { LoggingInterceptor } from './presentation/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './presentation/filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new AppLogger('InventoryService'),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Inventory Service running on port ${port}`);
}
bootstrap();
