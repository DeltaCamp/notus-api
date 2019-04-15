import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

import { transactionContextRunner } from './transactionContextRunner'

@Injectable()
export class TransactionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    return transactionContextRunner(next);
  }
}
