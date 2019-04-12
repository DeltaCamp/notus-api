import { Injectable, Inject, forwardRef } from '@nestjs/common';

import {
  DappEntity,
  EventTypeEntity,
  UserEntity,
  EventTypeMatcherEntity
} from '../entities'
import { EventTypeMatcherService } from '../event-type-matchers/EventTypeMatcherService'
import { EventTypeDto } from './EventTypeDto'
import { EventService } from '../events/EventService'
import { DappService } from '../dapps/DappService'
import { Transaction, EntityManagerProvider } from '../typeorm'

@Injectable()
export class EventTypeService {

  constructor (
    private readonly provider: EntityManagerProvider,
    private readonly eventTypeMatcherService: EventTypeMatcherService,
    private readonly eventService: EventService,
    @Inject(forwardRef(() => DappService))
    private readonly dappService: DappService
  ) {}

  @Transaction()
  async findOne(id): Promise<EventTypeEntity> {
    return this.provider.get().findOne(EventTypeEntity, id)
  }

  @Transaction()
  async find(): Promise<EventTypeEntity[]> {
    return this.provider.get().find(EventTypeEntity)
  }

  @Transaction()
  async findOneOrFail(id): Promise<EventTypeEntity> {
    return this.provider.get().findOneOrFail(EventTypeEntity, id)
  }

  @Transaction()
  async createEventType(user: UserEntity, eventTypeDto: EventTypeDto): Promise<EventTypeEntity> {

    const eventType = new EventTypeEntity()
    eventType.dapp = await this.dappService.findOrCreate(user, eventTypeDto.dapp)
    eventType.name = eventTypeDto.name

    await this.provider.get().save(eventType)

    eventType.eventTypeMatchers = await Promise.all(eventTypeDto.matchers.map(matcherDto => (
      this.eventTypeMatcherService.createEventTypeMatcher(eventType, matcherDto)
    )))

    return eventType
  }

  @Transaction()
  async update(eventType: EventTypeEntity, eventTypeDto: EventTypeDto): Promise<EventTypeEntity> {
    eventType.name = eventTypeDto.name
    await this.provider.get().save(eventType)
    return eventType
  }

  @Transaction()
  async destroy(eventType: EventTypeEntity) {
    await Promise.all(eventType.eventTypeMatchers.map((eventTypeMatcher) => {
      return this.eventTypeMatcherService.destroy(eventTypeMatcher)
    }))

    await Promise.all(eventType.events.map((event) => {
      return this.eventService.destroy(event)
    }))

    await this.provider.get().delete(EventTypeEntity, eventType.id)
  }

  @Transaction()
  async getEventTypeMatchers(eventType: EventTypeEntity): Promise<EventTypeMatcherEntity[]> {
    return this.provider.get().createQueryBuilder()
      .select('event_type_matchers')
      .from(EventTypeMatcherEntity, 'event_type_matchers')
      .innerJoin('event_type_matchers.eventType', 'event_types')
      .where('event_types.id = :id', { id: eventType.id })
      .getMany()
  }

  @Transaction()
  async getDapp(eventType: EventTypeEntity): Promise<DappEntity> {
    return this.provider.get().createQueryBuilder()
      .select('dapps')
      .from(DappEntity, 'dapps')
      .innerJoin('dapps.eventTypes', 'event_types')
      .where('event_types.id = :id', { id: eventType.id })
      .printSql()
      .getOne()
  }
}
