import { Injectable } from '@nestjs/common'
import {
  AbiEventInputEntity
} from '../entities'
import { Transaction, EntityManagerProvider } from '../transactions'

import { notDefined } from '../utils/notDefined'
import { AbiEventInputDto } from './AbiEventInputDto';

@Injectable()
export class AbiEventInputService {

  constructor (
    private readonly provider: EntityManagerProvider
  ) {}

  @Transaction()
  async findOneOrFail(id: number): Promise<AbiEventInputEntity> {
    if (notDefined(id)) { throw new Error('id must be defined') }
    return await this.provider.get().findOneOrFail(AbiEventInputEntity, id, { relations: ['abiEvent', 'abiEvent.abi' ]})
  }

  @Transaction()
  async findByNameAndAbiEventId(name: String, abiEventId: number): Promise<AbiEventInputEntity[]> {
    let query = await this.provider.get().createQueryBuilder(AbiEventInputEntity, 'abiEventInput')
      .where('"abiEventInput"."createdAt" IS NOT NULL')

    if (name !== undefined) {
      query = query.andWhere('"abiEventInput"."name" = :name', { name })
    }

    if (abiEventId !== undefined) {
      query = query.andWhere('"abiEventInput"."abiEventId" = :abiEventId', { abiEventId })
    }

    return query.getMany()
  }

  @Transaction()
  async update(abiEventInput: AbiEventInputEntity, abiEventInputDto: AbiEventInputDto): Promise<AbiEventInputEntity> {
    if (abiEventInputDto.metaType !== undefined) {
      abiEventInput.metaType = abiEventInputDto.metaType
    }
    if (abiEventInputDto.isPublic !== undefined) {
      abiEventInput.isPublic = abiEventInputDto.isPublic
    }
    await this.provider.get().save(abiEventInput)
    return abiEventInput
  }
}