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
import { VariableTypeEntity } from './VariableTypeEntity'
import { VariableType } from './VariableType'
import { VariableTypeTitle } from './VariableTypeTitle'
import { VariableTypeType } from './VariableTypeType'

@Resolver(of => VariableEntity)
export class VariableResolver {

  constructor(
    private readonly variableService: VariableService,
    private readonly dappUserService: DappUserService,
    @Inject(forwardRef(() => EventTypeService))
    private readonly eventTypeService: EventTypeService
  ) {}

  @Query(returns => [VariableTypeEntity])
  variableTypes(): VariableTypeEntity[] {
    return Object.keys(VariableType).map(key => {
      const variableType = new VariableTypeEntity()
      variableType.id = VariableType[key];
      variableType.title = VariableTypeTitle[key];
      variableType.type = VariableTypeType[key];
      return variableType
    })
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => VariableEntity)
  async createVariable(
    @GqlAuthUser() user: UserEntity,
    @Args('variable') variableDto: VariableDto
  ): Promise<VariableEntity> {
    const eventType = await this.getEventTypeAndAuth(user, variableDto.eventTypeId)
    return await this.variableService.createVariable(eventType, variableDto)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => VariableEntity)
  async updateVariable(
    @GqlAuthUser() user: UserEntity,
    @Args('variable') variableDto: VariableDto
  ): Promise<VariableEntity> {
    const eventType = await this.getEventTypeAndAuth(user, variableDto.eventTypeId)
    return await this.variableService.updateVariable(variableDto)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Boolean)
  async destroyVariable(
    @GqlAuthUser() user: UserEntity,
    @Args('variableId') variableId: number
  ): Promise<Boolean> {
    const variable = await this.variableService.findOneOrFail(variableId)
    const eventType = await this.getEventTypeAndAuth(user, variable.eventTypeId)
    await this.variableService.destroy(variable)
    return true
  }

  async getEventTypeAndAuth(user: UserEntity, eventTypeId: number): Promise<EventTypeEntity> {
    const eventType = await this.eventTypeService.findOneOrFail(eventTypeId)
    const isDappOwner = await this.dappUserService.isOwner(eventType.dappId, user.id)
    if (!isDappOwner) {
      throw new UnauthorizedException()
    }
    return eventType
  }
}
