import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { rollbar } from '../rollbar'

@Catch()
export class RollbarExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    rollbar.error(exception)
    super.catch(exception, host);
  }
}
