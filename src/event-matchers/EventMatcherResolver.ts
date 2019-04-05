import { UseGuards, UnauthorizedException } from '@nestjs/common'
import { Resolver, ResolveProperty, Parent } from '@nestjs/graphql'

import { UserEntity } from '../users'
import { EventMatcherEntity } from './EventMatcherEntity'
import { EventMatcherService } from './EventMatcherService'
import { MatcherEntity } from '../matchers'

const debug = require('debug')('notus:EventMatcherResolver')

@Resolver(of => EventMatcherEntity)
export class EventMatcherResolver {

  constructor(
    private readonly eventMatcherService: EventMatcherService
  ) {}

  @ResolveProperty('matcher')
  async matcher(@Parent() event: EventMatcherEntity): Promise<MatcherEntity> {
    debug('!!!!!!!!!!!!! Resolving...')
    return await this.eventMatcherService.getMatcher(event)
  }
}
