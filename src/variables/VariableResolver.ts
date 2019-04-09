import { UseGuards, UnauthorizedException } from '@nestjs/common'
import { Mutation, Resolver, Query, Args, ResolveProperty, Parent } from '@nestjs/graphql'
import { GqlAuthGuard } from '../auth/GqlAuthGuard'

import { GqlAuthUser } from '../decorators/GqlAuthUser'
import {
  UserEntity,
  VariableEntity
} from '../entities'
import { VariableService } from './VariableService'
import { VariableDto } from './VariableDto'
import { EventTypeService } from '../event-types'
import { DappUserService } from '../dapp-users/DappUserService'

@Resolver(of => VariableEntity)
export class VariableResolver {

  constructor(
    private readonly variableService: VariableService,
    private readonly eventTypeService: EventTypeService,
    private readonly dappUserService: DappUserService
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => VariableEntity)
  async createVariable(
    @GqlAuthUser() user: UserEntity,
    @Args('variable') variableDto: VariableDto
  ): Promise<VariableEntity> {
    const eventType = await this.eventTypeService.findOneOrFail(variableDto.eventTypeId)
    const isDappOwner = await this.dappUserService.isOwner(eventType.dappId, user.id)
    if (!isDappOwner) {
      throw new UnauthorizedException()
    }
    return await this.variableService.createVariable(eventType, variableDto)
  }
}
