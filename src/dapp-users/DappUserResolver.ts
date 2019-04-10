import { UseGuards, UnauthorizedException, Inject, forwardRef } from '@nestjs/common'
import { Parent, Resolver, ResolveProperty, Query, Args } from '@nestjs/graphql'
import { Arg } from 'type-graphql'
import { GqlAuthGuard } from '../auth/GqlAuthGuard'

import { GqlAuthUser } from '../decorators/GqlAuthUser'
import { UserEntity, DappUserEntity, DappEntity } from '../entities'
import { DappUserService } from './DappUserService'
import { DappService } from '../dapps/DappService'

const debug = require('debug')('notus:DappUserResolver')

@Resolver(of => DappUserEntity)
export class DappUserResolver {

  constructor(
    // @Inject(forwardRef(() => DappService))
    private readonly dappService: DappService,
    private readonly dappUserService: DappUserService
  ) {}

  @Query(returns => [DappUserEntity], { nullable: false })
  async dappUsers(
    @Args({ name: 'userId', nullable: true, type: () => Number }) userId?: number,
    @Args({ name: 'owner', nullable: true, type: () => Boolean }) owner?: Boolean
  ) {
    const parameters: any = {}
    if (userId !== undefined) {
      parameters.userId = userId
    }
    if (owner !== undefined) {
      parameters.owner = owner
    }
    return await this.dappUserService.findAll(parameters);
  }

  @ResolveProperty('dapp')
  async dapp(@Parent() dappUser: DappUserEntity): Promise<DappEntity> {
    return await this.dappService.findOneOrFail(dappUser.dappId)
  }
}
