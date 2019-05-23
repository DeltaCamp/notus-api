import { UnauthorizedException, UseFilters } from '@nestjs/common'
import { Resolver, Query, Args } from '@nestjs/graphql'

import { UserService } from '../users/UserService'
import { AuthJwtService } from './AuthJwtService'
import { GqlRollbarExceptionFilter } from '../filters/GqlRollbarExceptionFilter';
import { OneTimeKeyValidEntity } from './OneTimeKeyValidEntity';

@UseFilters(new GqlRollbarExceptionFilter())
@Resolver()
export class AuthResolver {

  constructor(
    private readonly userService: UserService,
    private readonly authJwtService: AuthJwtService
  ) {}

  @Query(returns => OneTimeKeyValidEntity)
  async oneTimeKeyValid(@Args('oneTimeKey') oneTimeKey: string): Promise<OneTimeKeyValidEntity> {
    let user = await this.userService.findOneByOneTimeKey(oneTimeKey)
    let oneTimeKeyValid = new OneTimeKeyValidEntity()
    if (!user) {
      oneTimeKeyValid.valid = false
    } else {
      oneTimeKeyValid.valid = user.one_time_key_expires_at && user.one_time_key_expires_at < new Date()
    }
    oneTimeKeyValid.expiresAt = user.one_time_key_expires_at
    return oneTimeKeyValid
  }

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
