import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

import { EventTypeEntity } from './EventTypeEntity'
import { EventTypeMatcherService } from '../event-type-matchers/EventTypeMatcherService'
import { EventTypeDto } from './EventTypeDto'
import { DappEntity } from '../dapps/DappEntity'
import { UserEntity } from '../users/UserEntity'
import { VariableService } from '../variables/VariableService'

@Injectable()
export class EventTypeService {

  constructor (
    @InjectRepository(EventTypeEntity)
    private readonly eventTypeRepository: Repository<EventTypeEntity>,
    @InjectRepository(DappEntity)
    private readonly dappRepository: Repository<DappEntity>,
    private readonly variableService: VariableService,
    private readonly eventTypeMatcherService: EventTypeMatcherService
  ) {}

  async findOne(id): Promise<EventTypeEntity> {
    return this.eventTypeRepository.findOne(id, { relations: ['dapp'] })
  }

  async findOneOrFail(id): Promise<EventTypeEntity> {
    return this.eventTypeRepository.findOneOrFail(id, { relations: ['dapp'] })
  }

  async createEventType(eventTypeDto: EventTypeDto): Promise<EventTypeEntity> {

    const eventType = new EventTypeEntity()
    eventType.dapp = await this.dappRepository.findOneOrFail(eventTypeDto.dappId)
    eventType.name = eventTypeDto.name

    await this.eventTypeRepository.save(eventType)

    eventType.variables = await Promise.all(eventTypeDto.variables.map((variableDto) => (
      this.variableService.createVariable(eventType, variableDto)
    )))

    eventType.eventTypeMatchers = await Promise.all(eventTypeDto.matchers.map(matcherDto => (
      this.eventTypeMatcherService.createEventTypeMatcher(eventType, matcherDto)
    )))

    return eventType
  }
}
