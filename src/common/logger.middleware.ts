import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req, res, next) {
    console.log('Request...');
    next();
  }
}

export function GlobalLoggerMiddleware(req, res, next) {
  console.log('Global Logger');
  next();
}
