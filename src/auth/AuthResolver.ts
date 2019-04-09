import { UseGuards, UnauthorizedException } from '@nestjs/common'
import { Mutation, Resolver, Query, Args, ResolveProperty, Parent } from '@nestjs/graphql'

import { GqlAuthGuard } from './GqlAuthGuard'
import { GqlAuthUser } from '../decorators/GqlAuthUser'
import { UserService } from '../users'
import { AuthJwtService } from './AuthJwtService'

@Resolver()
export class AuthResolver {

  constructor(
    private readonly userService: UserService,
    private readonly authJwtService: AuthJwtService
  ) {}

  @Query(returns => String)
  async jwt(@Args('email') email: string, @Args('password') password: string): Promise<String> {
    let userEntity = await this.userService.findByEmailAndPassword(email, password)
    if (!userEntity) {
      throw new UnauthorizedException()
    }
    return this.authJwtService.signIn(userEntity)
  }
}
