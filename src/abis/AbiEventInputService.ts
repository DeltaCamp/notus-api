import { Injectable } from '@nestjs/common'
import {
  AbiEventInputEntity
} from '../entities'
import { Transaction, EntityManagerProvider } from '../transactions'

import { notDefined } from '../utils/notDefined'

@Injectable()
export class AbiEventInputService {

  constructor (
    private readonly provider: EntityManagerProvider
  ) {}

  @Transaction()
  async findOneOrFail(id: number): Promise<AbiEventInputEntity> {
    if (notDefined(id)) { throw new Error('id must be defined') }
    return await this.provider.get().findOneOrFail(AbiEventInputEntity, id)
  }

  @Transaction()
  async findByNameAndAbiEventId(name: String, abiEventId: number): Promise<AbiEventInputEntity[]> {
    let query = await this.provider.get().createQueryBuilder(AbiEventInputEntity, 'abiEventInput')

    if (name !== undefined) {
      query = query.where('"abiEventInput"."name" = :name', { name })
    }

    if (abiEventId !== undefined) {
      query = query.where('"abiEventInput"."abiEventId" = :abiEventId', { abiEventId })
    }

    return query.getMany()
  }
}