import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { rollbar } from '../rollbar'

@Catch()
export class GqlRollbarExceptionFilter implements GqlExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    rollbar.error(exception)
    return exception;
  }
}