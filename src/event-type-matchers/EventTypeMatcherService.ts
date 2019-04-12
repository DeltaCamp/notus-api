import { Injectable, Inject, forwardRef } from '@nestjs/common'

import { MatcherEntity, EventTypeEntity, EventTypeMatcherEntity } from '../entities'
import { MatcherService } from '../matchers/MatcherService'
import { MatcherDto } from '../matchers/MatcherDto'
import { Transaction } from '../typeorm/Transaction'
import { EntityManagerProvider } from '../typeorm/EntityManagerProvider'
import { EventTypeMatcherDto } from './EventTypeMatcherDto'

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
  async update(eventTypeMatcherDto: EventTypeMatcherDto): Promise<EventTypeMatcherEntity> {
    await this.matcherService.update(eventTypeMatcherDto.matcher)
    return await this.findOneOrFail(eventTypeMatcherDto.id)
  }

  @Transaction()
  async findOneOrFail(eventTypeMatcherId: number): Promise<EventTypeMatcherEntity> {
    return await this.provider.get().findOneOrFail(EventTypeMatcherEntity, eventTypeMatcherId)
  }

  @Transaction()
  async destroy(eventTypeMatcher: EventTypeMatcherEntity) {
    await this.matcherService.destroy(eventTypeMatcher.matcherId)
    await this.provider.get().delete(EventTypeMatcherEntity, eventTypeMatcher.id)
  }

  @Transaction()
  async getMatcher(eventTypeMatcher: EventTypeMatcherEntity): Promise<MatcherEntity> {
    return await this.matcherService.findOne(eventTypeMatcher.matcherId)
  }
}
