import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalLoggerMiddleware } from './common/logger.middleware';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { HttpExceptionFilter } from './common/exception/httpException.filter';
import { LoggingInterceptor } from './common/logging.interceptor';
import { transformInterceptor } from './common/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new transformInterceptor(),
  );
  app.use(GlobalLoggerMiddleware);
  await app.listen(3000);
}
bootstrap();
