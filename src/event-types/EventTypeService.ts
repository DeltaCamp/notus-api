import { Injectable, Inject, forwardRef } from '@nestjs/common';

import {
  DappEntity,
  EventTypeEntity,
  UserEntity,
  VariableEntity,
  EventTypeMatcherEntity
} from '../entities'
import { EventTypeMatcherService } from '../event-type-matchers/EventTypeMatcherService'
import { EventTypeDto } from './EventTypeDto'
import { VariableService } from '../variables/VariableService'
import { EventService } from '../events/EventService'
import { Transaction, EntityManagerProvider } from '../typeorm'

@Injectable()
export class EventTypeService {

  constructor (
    private readonly provider: EntityManagerProvider,
    private readonly variableService: VariableService,
    private readonly eventTypeMatcherService: EventTypeMatcherService,
    private readonly eventService: EventService
  ) {}

  @Transaction()
  async findOne(id): Promise<EventTypeEntity> {
    return this.provider.get().findOne(EventTypeEntity, id)
  }

  @Transaction()
  async findOneOrFail(id): Promise<EventTypeEntity> {
    return this.provider.get().findOneOrFail(EventTypeEntity, id)
  }

  @Transaction()
  async createEventType(eventTypeDto: EventTypeDto): Promise<EventTypeEntity> {

    const eventType = new EventTypeEntity()
    eventType.dapp = await this.provider.get().findOneOrFail(DappEntity, eventTypeDto.dappId)
    eventType.name = eventTypeDto.name

    await this.provider.get().save(eventType)

    eventType.variables = await Promise.all(eventTypeDto.variables.map((variableDto) => (
      this.variableService.createVariable(eventType, variableDto)
    )))

    eventType.eventTypeMatchers = await Promise.all(eventTypeDto.matchers.map(matcherDto => (
      this.eventTypeMatcherService.createEventTypeMatcher(eventType, matcherDto)
    )))

    return eventType
  }

  @Transaction()
  async destroy(eventType: EventTypeEntity) {
    await Promise.all(eventType.variables.map((variable) => {
      return this.variableService.destroy(variable)
    }))

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

  @Transaction()
  async getVariables(eventType: EventTypeEntity): Promise<VariableEntity[]> {
    return this.provider.get().createQueryBuilder()
      .select('variables')
      .from(VariableEntity, 'variables') .innerJoin('variables.eventType', 'event_types')
      .where('event_types.id = :id', { id: eventType.id })
      .printSql()
      .getMany()
  }
}
