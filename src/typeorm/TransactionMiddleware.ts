import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { createNamespace, getNamespace } from "cls-hooked";

const context = createNamespace("__cls__context");

@Injectable()
export class TransactionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    context.run(() => next());
  }
}
