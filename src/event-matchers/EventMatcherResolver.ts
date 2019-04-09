import { UseGuards, UnauthorizedException } from '@nestjs/common'
import { Resolver, ResolveProperty, Parent } from '@nestjs/graphql'

import { UserEntity, EventMatcherEntity, MatcherEntity } from '../entities'
import { EventMatcherService } from './EventMatcherService'

const debug = require('debug')('notus:EventMatcherResolver')

@Resolver(of => EventMatcherEntity)
export class EventMatcherResolver {

  constructor(
    private readonly eventMatcherService: EventMatcherService
  ) {}

  @ResolveProperty('matcher')
  async matcher(@Parent() event: EventMatcherEntity): Promise<MatcherEntity> {
    return await this.eventMatcherService.getMatcher(event)
  }
}
