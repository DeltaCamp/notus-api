import { UseGuards, UnauthorizedException, UseFilters } from '@nestjs/common'
import { Resolver, ResolveProperty, Parent, Mutation, Args } from '@nestjs/graphql'

import { GqlAuthGuard } from '../auth/GqlAuthGuard'
import { GqlAuthUser } from '../decorators/GqlAuthUser'
import {
  UserEntity,
  AbiEventEntity,
  MatcherEntity,
  EventEntity
} from '../entities'
import { MatcherDto } from './MatcherDto'
import { MatcherService } from './MatcherService'
import { EventService } from '../events/EventService'
import { AbiEventService } from '../abis/AbiEventService'

const debug = require('debug')('notus:MatcherResolver')
import { GqlRollbarExceptionFilter } from '../filters/GqlRollbarExceptionFilter';

@UseFilters(new GqlRollbarExceptionFilter())
@Resolver(of => MatcherEntity)
export class MatcherResolver {

  constructor(
    private readonly eventService: EventService,
    private readonly matcherService: MatcherService,
    private readonly abiEventService: AbiEventService
  ) {}

  @ResolveProperty('abiEventInput')
  async abiEventInput(@Parent() matcher: MatcherEntity): Promise<AbiEventEntity> {
    return await this.abiEventService.findOneOrFail(matcher.abiEventInputId)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => MatcherEntity)
  async createMatcher(
    @GqlAuthUser() user: UserEntity,
    @Args('matcher') matcherDto: MatcherDto
  ): Promise<MatcherEntity> {
    const event = await this.getEvent(user, matcherDto.eventId)
    return await this.matcherService.createMatcher(event, matcherDto)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => MatcherEntity)
  async updateMatcher(
    @GqlAuthUser() user: UserEntity,
    @Args('matcher') matcherDto: MatcherDto
  ): Promise<MatcherEntity> {
    debug('updateMatcher: ', matcherDto)
    const event = await this.getEvent(user, matcherDto.eventId)
    return await this.matcherService.update(matcherDto)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Boolean)
  async destroyMatcher(
    @GqlAuthUser() user: UserEntity,
    @Args('matcherId') matcherId: number
  ): Promise<Boolean> {
    const matcher = await this.matcherService.findOneOrFail(matcherId)
    const event = await this.getEvent(user, matcher.eventId)
    await this.matcherService.destroy(matcherId)
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
