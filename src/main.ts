import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalLoggerMiddleware } from './common/logger.middleware';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.use(GlobalLoggerMiddleware);
  await app.listen(3000);
}
bootstrap();
