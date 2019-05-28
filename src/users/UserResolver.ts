import { UseGuards, UseFilters, UnauthorizedException } from '@nestjs/common'
import { Resolver, ResolveProperty, Parent, Mutation, Args, Query } from '@nestjs/graphql'

import { GqlAuthGuard } from '../auth/GqlAuthGuard'
import { GqlAuthUser } from '../decorators/GqlAuthUser'
import {
  UserEntity
} from '../entities'
import { GqlRollbarExceptionFilter } from '../filters/GqlRollbarExceptionFilter';
import { UserDto } from './UserDto';
import { UserService } from './UserService';

@UseFilters(new GqlRollbarExceptionFilter())
@Resolver(of => UserEntity)
export class UserResolver {

  constructor (
    private readonly userService: UserService
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => UserEntity)
  async currentUser(@GqlAuthUser() user: UserEntity): Promise<UserEntity> {
    return user
  }

  @UseGuards(GqlAuthGuard)
  @ResolveProperty('email')
  async email(@GqlAuthUser() user: UserEntity, @Parent() requestedUser: UserEntity): Promise<string> {
    if (user.id === requestedUser.id) {
      return requestedUser.email
    } else {
      return ''
    }
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => UserEntity)
  async updateUser(@GqlAuthUser() user: UserEntity, @Args('user') userDto: UserDto) {
    return this.userService.update(user, userDto)
  }

}
