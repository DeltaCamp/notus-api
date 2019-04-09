import { Injectable } from '@nestjs/common';

import {
  EventTypeEntity,
  UserEntity,
  EventEntity,
  EventMatcherEntity
} from '../entities'
import { EventDto } from './EventDto'
import { EventMatcherService } from '../event-matchers/EventMatcherService'
import { Transaction, EntityManagerProvider } from '../typeorm'

@Injectable()
export class EventService {

  constructor (
    private readonly provider: EntityManagerProvider,
    private readonly eventMatcherService: EventMatcherService
  ) {}

  @Transaction()
  async findOne(id): Promise<EventEntity> {
    return this.provider.get().findOne(EventEntity, id)
  }

  @Transaction()
  async findOneOrFail(id): Promise<EventEntity> {
    return this.provider.get().findOneOrFail(EventEntity, id)
  }

  @Transaction()
  async findForUser(user: UserEntity): Promise<EventEntity[]> {
    return this.provider.get().find(EventEntity, { user })
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
  async getUser(event: EventEntity): Promise<UserEntity> {
    return this.provider.get().createQueryBuilder()
      .select('users')
      .from(UserEntity, 'users')
      .innerJoin('users.events', 'events')
      .where('events.id = :id', { id: event.id })
      .getOne()
  }

  @Transaction()
  async getEventType(event: EventEntity): Promise<EventTypeEntity> {
    return this.provider.get().createQueryBuilder()
      .select('event_types')
      .from(EventTypeEntity, 'event_types')
      .innerJoin('event_types.events', 'events')
      .where('events.id = :id', { id: event.id })
      .getOne()
  }

  @Transaction()
  async getEventMatchers(event: EventEntity): Promise<EventMatcherEntity[]> {
    return this.provider.get().createQueryBuilder()
      .select('event_matchers')
      .from(EventMatcherEntity, 'event_matchers')
      .innerJoin('event_matchers.event', 'events')
      .where('events.id = :id', { id: event.id })
      .printSql()
      .getMany()
  }

  @Transaction()
  async createEvent(user: UserEntity, eventDto: EventDto): Promise<EventEntity> {
    const event = new EventEntity()
    const em = this.provider.get()

    event.user = user;
    event.eventType =
      await em.findOneOrFail(EventTypeEntity, eventDto.eventTypeId)
    await em.save(event)

    event.eventMatchers = await Promise.all(eventDto.matchers.map(matcherDto => (
      this.eventMatcherService.createEventMatcher(event, matcherDto)
    )))

    return event
  }

  @Transaction()
  async destroy(event: EventEntity): Promise<boolean> {
    await this.provider.get().delete(EventEntity, event.id)
    return true
  }
}
