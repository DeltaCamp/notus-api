import { UseGuards, UnauthorizedException } from '@nestjs/common'
import { Mutation, Resolver, Query, Args, Parent, ResolveProperty } from '@nestjs/graphql'

import { GqlAuthGuard } from '../auth/GqlAuthGuard'
import { AuthUser } from '../decorators/AuthUser'
import { EventTypeEntity } from './EventTypeEntity'
import { EventTypeService } from './EventTypeService'
import { EventTypeDto } from './EventTypeDto'
import { DappEntity } from '../dapps/DappEntity'

@Resolver(of => EventTypeEntity)
export class EventTypeResolver {

  constructor(private readonly eventTypeService: EventTypeService) {}

  @Query(returns => EventTypeEntity)
  async contract(@Args('id') id: string): Promise<EventTypeEntity> {
    return await this.eventTypeService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => EventTypeEntity)
  async createEventType(@AuthUser() user, @Args('eventType') eventType: EventTypeDto): Promise<EventTypeEntity> {
    return await this.eventTypeService.createEventType(eventType)
  }

  @ResolveProperty('dapp')
  async dapp(@Parent() eventType: EventTypeEntity): Promise<DappEntity> {
    return eventType.dapp
  }
}
