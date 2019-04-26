import { UseGuards, UseFilters } from '@nestjs/common'
import { Resolver, ResolveProperty, Parent, Mutation, Args } from '@nestjs/graphql'

import { GqlAuthGuard } from '../auth/GqlAuthGuard'
import { GqlAuthUser } from '../decorators/GqlAuthUser'
import {
  UserEntity
} from '../entities'
import { GqlRollbarExceptionFilter } from '../filters/GqlRollbarExceptionFilter';

@UseFilters(new GqlRollbarExceptionFilter())
@Resolver(of => UserEntity)
export class UserResolver {

  @UseGuards(GqlAuthGuard)
  @ResolveProperty('email')
  async email(@GqlAuthUser() user: UserEntity, @Parent() requestedUser: UserEntity): Promise<string> {
    if (user.id === requestedUser.id) {
      return requestedUser.email
    } else {
      return ''
    }
  }

}
