import {
  AuthGuard
} from '@nestjs/passport'
import {
  Injectable, ExecutionContext
} from '@nestjs/common'
import {
  GqlExecutionContext
} from '@nestjs/graphql'

@Injectable()
export class OptionalGqlAuthGuard extends AuthGuard('optionalJwt') {
  handleRequest(err, user, info) {
    return user
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext().req;
  }
}
