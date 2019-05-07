import { Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { rollbar } from '../rollbar'
import { ValidationException } from '../common/ValidationException';

@Catch()
export class RollbarExceptionsFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (exception instanceof ValidationException) {
      return super.catch(new BadRequestException(exception.message), host)
    } else {
      rollbar.error(exception)
      return super.catch(exception, host);
    }
  }
}
