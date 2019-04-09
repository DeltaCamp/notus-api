import { UseGuards, UnauthorizedException } from '@nestjs/common'
import { Mutation, Resolver, Query, Args, ResolveProperty, Parent } from '@nestjs/graphql'
import { GqlAuthGuard } from '../auth/GqlAuthGuard'

import { GqlAuthUser } from '../decorators/GqlAuthUser'
import {
  UserEntity,
  EventEntity,
  EventTypeEntity,
  EventMatcherEntity
} from '../entities'
import { EventService } from './EventService'
import { EventDto } from './EventDto'

@Resolver(of => EventEntity)
export class EventResolver {

  constructor(
    private readonly eventService: EventService
  ) {}

  @Query(returns => EventEntity, { nullable: true })
  async event(@Args('id') id: string): Promise<EventEntity> {
    return await this.eventService.findOne(id);
  }

  @Query(returns => [EventEntity])
  @UseGuards(GqlAuthGuard)
  async events(@GqlAuthUser() user: UserEntity): Promise<EventEntity[]> {
    return await this.eventService.findForUser(user);
  }

  @ResolveProperty('eventType')
  async eventType(@Parent() event: EventEntity): Promise<EventTypeEntity> {
    return await this.eventService.getEventType(event)
  }

  @ResolveProperty('eventMatchers')
  async eventMatchers(@Parent() event: EventEntity): Promise<EventMatcherEntity[]> {
    return await this.eventService.getEventMatchers(event)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => EventEntity)
  async createEvent(
    @GqlAuthUser() user: UserEntity,
    @Args('event') eventDto: EventDto
  ): Promise<EventEntity> {
    const event = await this.eventService.createEvent(user, eventDto)
    return event
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => EventEntity)
  async destroy(
    @GqlAuthUser() user: UserEntity,
    @Args('event') eventDto: EventDto
  ): Promise<boolean> {
    return await this.eventService.destroyEvent(user, eventDto)
  }
}
