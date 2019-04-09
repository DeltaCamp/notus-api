import { UseGuards, UnauthorizedException, Inject, forwardRef } from '@nestjs/common'
import { Mutation, Resolver, Query, Args, ResolveProperty, Parent } from '@nestjs/graphql'

import { GqlAuthGuard } from '../auth/GqlAuthGuard'
import { GqlAuthUser } from '../decorators/GqlAuthUser'
import {
  UserEntity,
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
    const eventType = await this.eventTypeService.findOneOrFail(eventTypeMatcherDto.eventTypeId)
    const isDappOwner = await this.dappUserService.isOwner(eventType.dappId, user.id)
    if (!isDappOwner) {
      throw new UnauthorizedException()
    }
    return await this.eventTypeMatcherService.createEventTypeMatcher(eventType, eventTypeMatcherDto.matcher)
  }
}
