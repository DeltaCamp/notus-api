import { UseGuards, UnauthorizedException } from '@nestjs/common'
import { Mutation, Resolver, Query, Args, Parent, ResolveProperty } from '@nestjs/graphql'

import { GqlAuthGuard } from '../auth/GqlAuthGuard'
import { AuthUser } from '../decorators/AuthUser'
import { EventTypeEntity } from './EventTypeEntity'
import { EventTypeService } from './EventTypeService'
import { EventTypeDto } from './EventTypeDto'
import { DappEntity } from '../dapps'
import { VariableEntity } from '../variables'

@Resolver(of => EventTypeEntity)
export class EventTypeResolver {

  constructor(private readonly eventTypeService: EventTypeService) {}

  @Query(returns => EventTypeEntity)
  async findEventType(@Args('id') id: string): Promise<EventTypeEntity> {
    return await this.eventTypeService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => EventTypeEntity)
  async createEventType(@AuthUser() user, @Args('eventType') eventType: EventTypeDto): Promise<EventTypeEntity> {
    return await this.eventTypeService.createEventType(eventType)
  }

  @ResolveProperty('dapp')
  async dapp(@Parent() eventType: EventTypeEntity): Promise<DappEntity> {
    return await this.eventTypeService.getDapp(eventType)
  }

  @ResolveProperty('variables')
  async variables(@Parent() eventType: EventTypeEntity): Promise<VariableEntity[]> {
    return await this.eventTypeService.getVariables(eventType)
  }
}
