import { Injectable } from '@nestjs/common';

import { UserEntity } from '../users/UserEntity'
import { EventEntity } from './EventEntity'
import { EventTypeEntity } from '../event-types/EventTypeEntity'
import { EventDto } from './EventDto'
import { EventTypeService } from '../event-types/EventTypeService'
import { EventMatcherService } from '../event-matchers/EventMatcherService'
import { Transaction } from '../typeorm/Transaction'
import { EntityManagerProvider } from '../typeorm/EntityManagerProvider'

@Injectable()
export class EventService {

  constructor (
    private readonly provider: EntityManagerProvider,
    private readonly eventTypeService: EventTypeService,
    private readonly eventMatcherService: EventMatcherService
  ) {}

  @Transaction()
  async findOne(id): Promise<EventEntity> {
    return this.provider.get().findOne(EventEntity, id, { relations: ['user'] })
  }

  @Transaction()
  async findAllForMatch(): Promise<EventEntity[]> {
    return this.provider.get().find(EventEntity, {
      relations: [
        'user',
        'eventMatchers',
        'eventMatchers.matcher',
        'eventMatchers.matcher.variable',
        'eventType',
        'eventType.eventTypeMatchers',
        'eventType.eventTypeMatchers.matcher',
        'eventType.eventTypeMatchers.matcher.variable'
      ]
    })
  }

  @Transaction()
  async createEvent(user: UserEntity, eventDto: EventDto): Promise<EventEntity> {
    const event = new EventEntity()

    event.user = user;
    event.eventType =
      await this.provider.get().findOneOrFail(EventTypeEntity, eventDto.eventTypeId)
    await this.provider.get().save(event)

    event.eventMatchers = await Promise.all(eventDto.matchers.map(matcherDto => (
      this.eventMatcherService.createEventMatcher(event, matcherDto)
    )))

    return event
  }
}
