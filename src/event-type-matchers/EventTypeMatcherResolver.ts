import { UseGuards, UnauthorizedException, Inject, forwardRef } from '@nestjs/common'
import { Mutation, Resolver, Query, Args, ResolveProperty, Parent } from '@nestjs/graphql'

import { GqlAuthGuard } from '../auth/GqlAuthGuard'
import { GqlAuthUser } from '../decorators/GqlAuthUser'
import {
  UserEntity,
  EventTypeEntity,
  EventTypeMatcherEntity
} from '../entities'
import { EventTypeMatcherDto } from './EventTypeMatcherDto'
import { EventTypeMatcherService } from './EventTypeMatcherService'
import { EventTypeService } from '../event-types/EventTypeService'
import { DappUserService } from '../dapp-users/DappUserService'

@Resolver(of => EventTypeMatcherEntity)
export class EventTypeMatcherResolver {

  constructor(
    private readonly eventTypeService: EventTypeService,
    private readonly dappUserService: DappUserService,
    private readonly eventTypeMatcherService: EventTypeMatcherService
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => EventTypeMatcherEntity)
  async createEventTypeMatcher(
    @GqlAuthUser() user: UserEntity,
    @Args('eventTypeMatcher') eventTypeMatcherDto: EventTypeMatcherDto
  ): Promise<EventTypeMatcherEntity> {
    const eventType = await this.getEventType(user, eventTypeMatcherDto.eventTypeId)
    return await this.eventTypeMatcherService.createEventTypeMatcher(eventType, eventTypeMatcherDto.matcher)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => EventTypeMatcherEntity)
  async updateEventTypeMatcher(
    @GqlAuthUser() user: UserEntity,
    @Args('eventTypeMatcher') eventTypeMatcherDto: EventTypeMatcherDto
  ): Promise<EventTypeMatcherEntity> {
    const eventType = await this.getEventType(user, eventTypeMatcherDto.eventTypeId)
    return await this.eventTypeMatcherService.update(eventTypeMatcherDto)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => EventTypeMatcherEntity)
  async destroyEventTypeMatcher(
    @GqlAuthUser() user: UserEntity,
    @Args('eventTypeMatcherId') eventTypeMatcherId: number
  ): Promise<Boolean> {
    const eventTypeMatcher = await this.eventTypeMatcherService.findOneOrFail(eventTypeMatcherId)
    const eventType = await this.getEventType(user, eventTypeMatcher.eventTypeId)
    await this.eventTypeMatcherService.destroy(eventTypeMatcher)
    return true
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
