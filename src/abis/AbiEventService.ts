import { Injectable } from '@nestjs/common'

import {
  AbiEntity,
  AbiEventEntity,
  AbiEventInputEntity
} from '../entities'
import { Transaction, EntityManagerProvider } from '../transactions'

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
}