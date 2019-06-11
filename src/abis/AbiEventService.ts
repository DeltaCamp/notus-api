import { Injectable, Inject, forwardRef } from '@nestjs/common'
import { validate, ValidationError } from 'class-validator'

import { ValidationException } from '../common/ValidationException'
import {
  AbiEntity,
  AbiEventEntity,
  AbiEventInputEntity
} from '../entities'
import { notDefined } from '../utils/notDefined';
import { AbiEventsQuery } from './AbiEventsQuery'
import { AbiEventDto } from './AbiEventDto'
import { AbiEventInputService } from './AbiEventInputService';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, EntityManager } from 'typeorm';
import { Service } from '../Service';

@Injectable()
export class AbiEventService extends Service {

  constructor (
    @InjectConnection()
    connection: Connection,
    private readonly abiEventInputService: AbiEventInputService
  ) {
    super(connection)
  }

  async find(name: string, topic: string): Promise<AbiEventEntity[]> {
    let query = this.manager().createQueryBuilder()
      .select('abiEvents')
      .from(AbiEventEntity, 'abiEvents')

    if (name) {
      query = query.where('"abiEvents"."name" = :name', { name })
    }

    if (topic) {
      query = query.where('"abiEvents"."topic" = :topic', { topic })
    }
      
    return query.getMany()
  }

  async findOneOrFail(id: number): Promise<AbiEventEntity> {
    if (notDefined(id)) {
      throw new Error('id must be defined')
    }
    return await this.manager().findOneOrFail(AbiEventEntity, id)
  }

  async findAbiEvents(abi: AbiEntity): Promise<AbiEventEntity[]> {
    return await this.manager().find(AbiEventEntity, { abiId: abi.id })
  }
  
  async findAbiEventInputs(abiEvent: AbiEventEntity): Promise<AbiEventInputEntity[]> {
    return this.manager().createQueryBuilder()
      .select('abiEventInputs')
      .from(AbiEventInputEntity, 'abiEventInputs')
      .innerJoin('abiEventInputs.abiEvent', 'abiEvents')
      .where('"abiEvents"."id" = :id', { id: abiEvent.id })
      .getMany()
  }

  async findAndCount(params: AbiEventsQuery) {
    let query = await this.manager().createQueryBuilder(AbiEventEntity, 'abiEvents')

    if (params) {
      if (params.abiId) {
        query = query.andWhere('"abiEvents"."abiId" = :id', { id: params.abiId })
      }
      // if (params.isPublic) {
      //   query = query.andWhere('"events"."isPublic" IS TRUE')
      // }
      if (params.skip) {
        query = query.offset(params.skip)
      }
      if (params.take) {
        query = query.limit(params.take)
      }
    }

    return query.printSql().orderBy('"abiEvents"."name"', 'ASC').getManyAndCount()
  }

  async create(abi: AbiEntity, descriptor: any, entityManager?: EntityManager): Promise<AbiEventEntity> {

    const abiEvent = new AbiEventEntity()
    abiEvent.title = descriptor.name
    abiEvent.name = descriptor.name
    abiEvent.topic = abi.interface().events[descriptor.name].topic
    abiEvent.abi = abi

    await validate(abiEvent)

    await this.transaction(async manager => {
      manager.save(abiEvent)

      abiEvent.abiEventInputs = descriptor.inputs.map((input: any) => {
        return this.abiEventInputService.create(abiEvent, input.name, input.type, manager)
      })
    }, entityManager)
    
    return abiEvent
  }

  async update(abiEvent: AbiEventEntity, abiEventDto: AbiEventDto): Promise<AbiEventEntity> {
    if (abiEventDto.isPublic !== undefined) {
      abiEvent.isPublic = abiEventDto.isPublic
    }

    if (abiEventDto.title !== undefined) {
      abiEvent.title = abiEventDto.title
    }

    await validate(abiEvent)

    await this.transaction(async manager => {
      manager.save(abiEvent)
    })
    
    return abiEvent
  }

  async validate(abiEvent: AbiEventEntity) {
    const errors: ValidationError[] = await validate(event)

    if (errors.length > 0) {
      throw new ValidationException(`Event is invalid`, errors)
    }
  }
}
