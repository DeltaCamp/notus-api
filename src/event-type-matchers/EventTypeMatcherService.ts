import { Injectable, Inject, forwardRef } from '@nestjs/common'

import { EventTypeEntity, EventTypeMatcherEntity } from '../entities'
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

  @Transaction()
  async destroy(eventTypeMatcher: EventTypeMatcherEntity) {
    await this.matcherService.destroy(eventTypeMatcher.matcherId)
    await this.provider.get().delete(EventTypeMatcherEntity, eventTypeMatcher.id)
  }
}
