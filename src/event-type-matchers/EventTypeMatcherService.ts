import { Injectable } from '@nestjs/common'

import { EventTypeEntity } from '../event-types/EventTypeEntity'
import { EventTypeMatcherEntity } from './EventTypeMatcherEntity'
import { MatcherService } from '../matchers/MatcherService'
import { MatcherDto } from '../matchers/MatcherDto'
import { Transaction } from '../typeorm/Transaction'
import { EntityManagerProvider } from '../typeorm/EntityManagerProvider'

@Injectable()
export class EventTypeMatcherService {

  constructor (
    private readonly provider: EntityManagerProvider,
    private readonly matcherService: MatcherService
  ) {}

  @Transaction()
  async createEventTypeMatcher(eventType: EventTypeEntity, matcherDto: MatcherDto): Promise<EventTypeMatcherEntity> {
    const eventTypeMatcher = new EventTypeMatcherEntity()
    eventTypeMatcher.eventType = eventType
    eventTypeMatcher.matcher = await this.matcherService.createMatcher(matcherDto)
    this.provider.get().save(eventTypeMatcher)

    return eventTypeMatcher
  }
}
