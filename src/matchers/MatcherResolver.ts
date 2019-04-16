import { UseGuards, UnauthorizedException } from '@nestjs/common'
import { Resolver, ResolveProperty, Parent, Mutation, Args } from '@nestjs/graphql'

import { GqlAuthGuard } from '../auth/GqlAuthGuard'
import { GqlAuthUser } from '../decorators/GqlAuthUser'
import {
  UserEntity,
  ContractEventEntity,
  MatcherEntity,
  EventEntity
} from '../entities'
import { MatcherDto } from './MatcherDto'
import { MatcherService } from './MatcherService'
import { EventService } from '../events/EventService'
import { ContractEventService } from '../contracts/ContractEventService'

const debug = require('debug')('notus:MatcherResolver')

@Resolver(of => MatcherEntity)
export class MatcherResolver {

  constructor(
    private readonly eventService: EventService,
    private readonly matcherService: MatcherService,
    private readonly contractEventService: ContractEventService
  ) {}

  @ResolveProperty('operandContractEvent')
  async operandContractEvent(@Parent() matcher: MatcherEntity): Promise<ContractEventEntity> {
    const contractEvents = await this.contractEventService.find(undefined, matcher.operand)
    if (contractEvents.length) {
      return contractEvents[0]
    }
    return null
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
