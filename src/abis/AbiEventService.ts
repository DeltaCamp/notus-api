import { Injectable } from '@nestjs/common'

import {
  AbiEntity,
  AbiEventEntity,
  AbiEventInputEntity
} from '../entities'
import { Transaction, EntityManagerProvider } from '../transactions'
import { notDefined } from '../utils/notDefined';
import { AbiEventsQuery } from './AbiEventsQuery'
import { AbiEventDto } from './AbiEventDto'
import { AbiEventInputService } from './AbiEventInputService';

@Injectable()
export class AbiEventService {

  constructor (
    private readonly provider: EntityManagerProvider,
    private readonly abiEventInputService: AbiEventInputService
  ) {}

  @Transaction()
  async find(name: string, topic: string): Promise<AbiEventEntity[]> {
    let query = this.provider.get().createQueryBuilder()
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

  @Transaction()
  async findOneOrFail(id: number): Promise<AbiEventEntity> {
    if (notDefined(id)) {
      throw new Error('id must be defined')
    }
    return await this.provider.get().findOneOrFail(AbiEventEntity, id)
  }

  @Transaction()
  async findAbiEvents(abi: AbiEntity): Promise<AbiEventEntity[]> {
    return await this.provider.get().find(AbiEventEntity, { abiId: abi.id })
  }
  
  @Transaction()
  async findAbiEventInputs(abiEvent: AbiEventEntity): Promise<AbiEventInputEntity[]> {
    return this.provider.get().createQueryBuilder()
      .select('abiEventInputs')
      .from(AbiEventInputEntity, 'abiEventInputs')
      .innerJoin('abiEventInputs.abiEvent', 'abiEvents')
      .where('"abiEvents"."id" = :id', { id: abiEvent.id })
      .getMany()
  }

  @Transaction()
  async findAndCount(params: AbiEventsQuery) {
    let query = await this.provider.get().createQueryBuilder(AbiEventEntity, 'abiEvents')

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

  @Transaction()
  async create(abi: AbiEntity, descriptor: any): Promise<AbiEventEntity> {

    const abiEvent = new AbiEventEntity()
    abiEvent.name = descriptor.name
    abiEvent.topic = abi.interface().events[descriptor.name].topic
    abiEvent.abi = abi

    this.provider.get().save(abiEvent)

    abiEvent.abiEventInputs = descriptor.inputs.map((input: any) => {
      return this.abiEventInputService.create(abiEvent, input.name, input.type)
    })
    
    return abiEvent
  }

  @Transaction()
  async update(abiEvent: AbiEventEntity, abiEventDto: AbiEventDto): Promise<AbiEventEntity> {
    if (abiEventDto.isPublic !== undefined) {
      abiEvent.isPublic = abiEventDto.isPublic
    }
    await this.provider.get().save(abiEvent)
    return abiEvent
  }
}
