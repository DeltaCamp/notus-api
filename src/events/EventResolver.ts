import { UseGuards, UnauthorizedException, UseFilters, HttpException } from '@nestjs/common'
import { Mutation, Resolver, Query, Args, ResolveProperty, Parent } from '@nestjs/graphql'
import { GqlAuthGuard } from '../auth/GqlAuthGuard'

import { GqlAuthUser } from '../decorators/GqlAuthUser'
import {
  UserEntity,
  EventEntity,
  AbiEventEntity,
  MatcherEntity
} from '../entities'
import { EventService } from './EventService'
import { EventDto } from './EventDto'

import { GqlRollbarExceptionFilter } from '../filters/GqlRollbarExceptionFilter';
import { EventsQuery } from './EventsQuery'
import { EventsQueryResponse } from './EventsQueryResponse';

@UseFilters(new GqlRollbarExceptionFilter())
@Resolver(of => EventEntity)
export class EventResolver {

  constructor(
    private readonly eventService: EventService
  ) {}

  @Query(returns => EventEntity, { nullable: true })
  async event(@Args('id') id: number): Promise<EventEntity> {
    return await this.eventService.findOne(id);
  }

  @Query(returns => EventsQueryResponse)
  async events(
    @GqlAuthUser() user: UserEntity,
    @Args({ name: 'eventsQuery', type: () => EventsQuery, nullable: true }) eventsQuery: EventsQuery): Promise<EventsQueryResponse> {
    const result = new EventsQueryResponse()
    const [events, totalCount] = await this.eventService.findAndCount(eventsQuery);
    result.events = events
    result.totalCount = totalCount
    if (eventsQuery) {
      result.skip = eventsQuery.skip
      result.take = eventsQuery.take
    }
    return result
  }

  @ResolveProperty('abiEvent')
  async abiEvent(@Parent() event: EventEntity): Promise<AbiEventEntity> {
    return await this.eventService.getAbiEvent(event)
  }

  @ResolveProperty('user')
  async user(@Parent() event: EventEntity): Promise<UserEntity> {
    if (event.user) { return event.user }
    return await this.eventService.getUser(event)
  }

  @ResolveProperty('matchers')
  async matchers(@Parent() event: EventEntity): Promise<MatcherEntity[]> {
    if (event.matchers && event.matchers.length > 0) { return event.matchers }
    return await this.eventService.getMatchers(event)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => EventEntity)
  @UseFilters(new GqlRollbarExceptionFilter())
  async createEvent(
    @GqlAuthUser() user: UserEntity,
    @Args('event') eventDto: EventDto
  ): Promise<EventEntity> {
    const event = await this.eventService.createEvent(user, eventDto)
    return event
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => EventEntity)
  async updateEvent(
    @GqlAuthUser() user: UserEntity,
    @Args('event') eventDto: EventDto
  ): Promise<EventEntity> {
    let event = await this.eventService.findOneOrFail(eventDto.id);
    if (event.userId !== user.id) {
      throw new UnauthorizedException()
    }
    event = await this.eventService.updateEvent(eventDto)
    return event
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => EventEntity)
  async deleteEvent(
    @GqlAuthUser() user: UserEntity,
    @Args('eventId') eventId: number
  ): Promise<EventEntity> {
    const event = await this.eventService.findOneOrFail(eventId);
    if (event.userId !== user.id) {
      throw new UnauthorizedException()
    }

    await this.eventService.deleteEvent(event.id)
    return event
  }
}
