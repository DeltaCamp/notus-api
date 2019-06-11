import {
  NotFoundException,
  UseGuards,
  UnauthorizedException,
  UseFilters
} from '@nestjs/common'
import {
  Mutation,
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent
} from '@nestjs/graphql'
import { GqlAuthGuard } from '../auth/GqlAuthGuard'
import { OptionalGqlAuthGuard } from '../auth/OptionalGqlAuthGuard'

import { GqlAuthUser } from '../decorators/GqlAuthUser'
import {
  ContractEntity,
  UserEntity,
  EventEntity,
  AbiEventEntity,
  MatcherEntity,
  WebhookHeaderEntity
} from '../entities'
import { EventService } from './EventService'
import { EventDto } from './EventDto'

import { GqlRollbarExceptionFilter } from '../filters/GqlRollbarExceptionFilter';
import { EventsQuery } from './EventsQuery'
import { EventsQueryResponse } from './EventsQueryResponse';
import { ContractService } from '../contracts/ContractService';

const debug = require('debug')('notus:events:EventResolver')

@UseFilters(new GqlRollbarExceptionFilter())
@Resolver(of => EventEntity)
export class EventResolver {

  constructor(
    private readonly eventService: EventService,
    private readonly contractService: ContractService
  ) {}

  @UseGuards(OptionalGqlAuthGuard)
  @Query(returns => EventEntity, { nullable: true })
  async event(
    @GqlAuthUser() user: UserEntity,
    @Args('id') id: number
  ): Promise<EventEntity> {
    const event = await this.eventService.findOne(id);
    if (event.deletedAt) {
      throw new NotFoundException()
    } else if (
      event.isPublic
      || (user && user.id === event.userId)
    ) {
      return event
    } else {
      throw new UnauthorizedException()
    }
  }

  @Query(returns => EventsQueryResponse)
  async events(
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

  @Mutation(returns => Number)
  async disableEventEmail(
    @Args('disableEmailKey') disableEmailKey: string
  ): Promise<number> {
    const event = await this.eventService.disableEventEmail(disableEmailKey)
    return event.id
  }

  @ResolveProperty('abiEvent')
  async abiEvent(@Parent() event: EventEntity): Promise<AbiEventEntity> {
    debug('abiEvent')
    return await this.eventService.getAbiEvent(event)
  }

  @ResolveProperty('contract')
  async contract(@Parent() event: EventEntity): Promise<ContractEntity> {
    debug('contract')
    if (event.contractId) {
      return await this.contractService.findOneOrFail(event.contractId)
    }
  }

  @ResolveProperty('user')
  async user(@Parent() event: EventEntity): Promise<UserEntity> {
    debug('user')
    if (event.user) { return event.user }
    return await this.eventService.getUser(event)
  }

  @ResolveProperty('matchers')
  async matchers(@Parent() event: EventEntity): Promise<MatcherEntity[]> {
    debug('matchers')
    if (event.matchers && event.matchers.length > 0) { return event.matchers }
    return await this.eventService.getMatchers(event)
  }

  @ResolveProperty('webhookHeaders')
  async webhookHeaders(@Parent() event: EventEntity): Promise<WebhookHeaderEntity[]> {
    debug('webhookHeaders')
    if (event.webhookHeaders && event.webhookHeaders.length > 0) { return event.webhookHeaders }
    return await this.eventService.getWebhookHeaders(event)
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
