import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'

import { EventTypeEntity } from '../event-types/EventTypeEntity'
import { EventTypeMatcherEntity } from './EventTypeMatcherEntity'
import { MatcherService } from '../matchers/MatcherService'
import { MatcherDto } from '../matchers/MatcherDto'

@Injectable()
export class EventTypeMatcherService {

  constructor (
    @InjectRepository(EventTypeMatcherEntity)
    private readonly eventTypeMatcherRepository: Repository<EventTypeMatcherEntity>,
    private readonly matcherService: MatcherService
  ) {}

  async createEventTypeMatcher(eventType: EventTypeEntity, matcherDto: MatcherDto): Promise<EventTypeMatcherEntity> {
    const eventTypeMatcher = new EventTypeMatcherEntity()
    eventTypeMatcher.eventType = eventType
    eventTypeMatcher.matcher = await this.matcherService.createMatcher(matcherDto)
    this.eventTypeMatcherRepository.save(eventTypeMatcher)

    return eventTypeMatcher
  }
}
