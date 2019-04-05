import { Injectable } from '@nestjs/common';

import { EventTypeEntity } from './EventTypeEntity'
import { EventTypeMatcherService } from '../event-type-matchers/EventTypeMatcherService'
import { EventTypeDto } from './EventTypeDto'
import { DappEntity } from '../dapps/DappEntity'
import { UserEntity } from '../users/UserEntity'
import { VariableService } from '../variables/VariableService'
import { Transaction } from '../typeorm/Transaction'
import { EntityManagerProvider } from '../typeorm/EntityManagerProvider'
import { VariableEntity } from '../variables'

@Injectable()
export class EventTypeService {

  constructor (
    private readonly provider: EntityManagerProvider,
    private readonly variableService: VariableService,
    private readonly eventTypeMatcherService: EventTypeMatcherService
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
