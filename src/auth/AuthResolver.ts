import { UnauthorizedException, UseFilters } from '@nestjs/common'
import { Resolver, Query, Args } from '@nestjs/graphql'

import { UserService } from '../users/UserService'
import { AuthJwtService } from './AuthJwtService'
import { GqlRollbarExceptionFilter } from '../filters/GqlRollbarExceptionFilter';

@UseFilters(new GqlRollbarExceptionFilter())
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


  @Query(returns => String)
  async Authorization(@Args('email') email: string, @Args('password') password: string): Promise<String> {
    let userEntity = await this.userService.findByEmailAndPassword(email, password)
    if (!userEntity) {
      throw new UnauthorizedException()
    }
    return `Bearer ${await this.authJwtService.signIn(userEntity)}`
  }
}
