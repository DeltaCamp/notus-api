import { Injectable } from '@nestjs/common'

import {
  AbiEntity,
  AbiEventEntity,
  AbiEventInputEntity
} from '../entities'
import { Transaction, EntityManagerProvider } from '../transactions'
import { notDefined } from '../utils/notDefined';
import { AbiEventDto } from './AbiEventDto'

@Injectable()
export class AbiEventService {

  constructor (
    private readonly provider: EntityManagerProvider
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
  async update(abiEvent: AbiEventEntity, abiEventDto: AbiEventDto): Promise<AbiEventEntity> {
    if (abiEventDto.isPublic !== undefined) {
      abiEvent.isPublic = abiEventDto.isPublic
    }
    await this.provider.get().save(abiEvent)
    return abiEvent
  }
}
