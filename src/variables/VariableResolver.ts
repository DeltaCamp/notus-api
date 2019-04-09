import { UseGuards, UnauthorizedException, Inject, forwardRef } from '@nestjs/common'
import { Mutation, Resolver, Query, Args, ResolveProperty, Parent } from '@nestjs/graphql'
import { GqlAuthGuard } from '../auth/GqlAuthGuard'

import { GqlAuthUser } from '../decorators/GqlAuthUser'
import {
  UserEntity,
  VariableEntity,
  EventTypeEntity
} from '../entities'
import { VariableService } from './VariableService'
import { VariableDto } from './VariableDto'
import { EventTypeService } from '../event-types/EventTypeService'
import { DappUserService } from '../dapp-users/DappUserService'

@Resolver(of => VariableEntity)
export class VariableResolver {

  constructor(
    private readonly variableService: VariableService,
    private readonly dappUserService: DappUserService,
    @Inject(forwardRef(() => EventTypeService))
    private readonly eventTypeService: EventTypeService
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => VariableEntity)
  async createVariable(
    @GqlAuthUser() user: UserEntity,
    @Args('variable') variableDto: VariableDto
  ): Promise<VariableEntity> {
    const eventType = await this.getEventType(user, variableDto.eventTypeId)
    return await this.variableService.createVariable(eventType, variableDto)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => VariableEntity)
  async updateVariable(
    @GqlAuthUser() user: UserEntity,
    @Args('variable') variableDto: VariableDto
  ): Promise<VariableEntity> {
    const eventType = await this.getEventType(user, variableDto.eventTypeId)
    return await this.variableService.updateVariable(variableDto)
  }

  async getEventType(user: UserEntity, eventTypeId: number): Promise<EventTypeEntity> {
    const eventType = await this.eventTypeService.findOneOrFail(eventTypeId)
    const isDappOwner = await this.dappUserService.isOwner(eventType.dappId, user.id)
    if (!isDappOwner) {
      throw new UnauthorizedException()
    }
    return eventType
  }
}
