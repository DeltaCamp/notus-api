import { UseGuards, UnauthorizedException } from '@nestjs/common'
import { Resolver, ResolveProperty, Parent, Mutation, Args } from '@nestjs/graphql'

import { GqlAuthGuard } from '../auth/GqlAuthGuard'
import { GqlAuthUser } from '../decorators/GqlAuthUser'
import {
  UserEntity,
  EventMatcherEntity,
  MatcherEntity,
  EventEntity
} from '../entities'
import { EventMatcherDto } from './EventMatcherDto'
import { EventMatcherService } from './EventMatcherService'
import { EventService } from '../events/EventService'

const debug = require('debug')('notus:EventMatcherResolver')

@Resolver(of => EventMatcherEntity)
export class EventMatcherResolver {

  constructor(
    private readonly eventService: EventService,
    private readonly eventMatcherService: EventMatcherService
  ) {}

  @ResolveProperty('matcher')
  async matcher(@Parent() event: EventMatcherEntity): Promise<MatcherEntity> {
    return await this.eventMatcherService.getMatcher(event)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => EventMatcherEntity)
  async createEventMatcher(
    @GqlAuthUser() user: UserEntity,
    @Args('eventMatcher') eventMatcherDto: EventMatcherDto
  ): Promise<EventMatcherEntity> {
    const event = await this.getEvent(user, eventMatcherDto.eventId)
    return await this.eventMatcherService.createEventMatcher(event, eventMatcherDto.matcher)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => EventMatcherEntity)
  async updateEventMatcher(
    @GqlAuthUser() user: UserEntity,
    @Args('eventMatcher') eventMatcherDto: EventMatcherDto
  ): Promise<EventMatcherEntity> {
    const event = await this.getEvent(user, eventMatcherDto.eventId)
    return await this.eventMatcherService.update(eventMatcherDto)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Boolean)
  async destroyEventMatcher(
    @GqlAuthUser() user: UserEntity,
    @Args('eventMatcherId') eventMatcherId: number
  ): Promise<Boolean> {
    const eventMatcher = await this.eventMatcherService.findOneOrFail(eventMatcherId)
    const event = await this.getEvent(user, eventMatcher.eventId)
    await this.eventMatcherService.destroy(eventMatcher)
    return true
  }

  async getEvent(user: UserEntity, eventId: number): Promise<EventEntity> {
    const event = await this.eventService.findOneOrFail(eventId)
    const isEventOwner = event.userId === user.id
    if (!isEventOwner) {
      throw new UnauthorizedException()
    }
    return event
  }
}
