import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { rollbar } from '../rollbar'

@Catch(HttpException)
export class GqlRollbarExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    rollbar.error(exception)
    return exception;
  }
}