import { UseGuards, UnauthorizedException } from '@nestjs/common'
import { Mutation, Resolver, Query, Args, ResolveProperty, Parent } from '@nestjs/graphql'
import { GqlAuthGuard } from '../auth/GqlAuthGuard'

import { GqlAuthUser } from '../decorators/GqlAuthUser'
import {
  UserEntity,
  EventEntity,
  ContractEventEntity,
  MatcherEntity
} from '../entities'
import { EventService } from './EventService'
import { EventDto } from './EventDto'

@Resolver(of => EventEntity)
export class EventResolver {

  constructor(
    private readonly eventService: EventService
  ) {}

  @Query(returns => EventEntity, { nullable: true })
  async event(@Args('id') id: number): Promise<EventEntity> {
    return await this.eventService.findOne(id);
  }

  @Query(returns => [EventEntity])
  @UseGuards(GqlAuthGuard)
  async events(@GqlAuthUser() user: UserEntity): Promise<EventEntity[]> {
    return await this.eventService.findForUser(user);
  }

  @Query(returns => [EventEntity])
  async publicEvents(): Promise<EventEntity[]> {
    return await this.eventService.findPublic();
  }

  @ResolveProperty('contractEvent')
  async contractEvent(@Parent() event: EventEntity): Promise<ContractEventEntity> {
    return await this.eventService.getContractEvent(event)
  }

  @ResolveProperty('user')
  async user(@Parent() event: EventEntity): Promise<UserEntity> {
    return await this.eventService.getUser(event)
  }

  @ResolveProperty('matchers')
  async matchers(@Parent() event: EventEntity): Promise<MatcherEntity[]> {
    return await this.eventService.getMatchers(event)
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
  async destroyEvent(
    @GqlAuthUser() user: UserEntity,
    @Args('eventId') eventId: number
  ): Promise<boolean> {
    const event = await this.eventService.findOneOrFail(eventId);
    if (event.userId !== user.id) {
      throw new UnauthorizedException()
    }
    return await this.eventService.destroy(event)
  }
}
