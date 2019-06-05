import { Injectable } from '@nestjs/common'
import {
  AbiEventInputEntity,
  AbiEventEntity
} from '../entities'
import { Transaction, EntityManagerProvider } from '../transactions'

import { notDefined } from '../utils/notDefined'
import { AbiEventInputDto } from './AbiEventInputDto';
import { SolidityDataType } from '../common/SolidityDataType';

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
  async create(abiEvent: AbiEventEntity, name: string, type: SolidityDataType): Promise<AbiEventInputEntity> {
    const abiEventInput = new AbiEventInputEntity()
    abiEventInput.name = name
    abiEventInput.type = type
    abiEventInput.abiEvent = abiEvent

    this.provider.get().save(abiEventInput)

    return abiEventInput
  }

  @Transaction()
  async update(abiEventInput: AbiEventInputEntity, abiEventInputDto: AbiEventInputDto): Promise<AbiEventInputEntity> {
    if (abiEventInputDto.metaType !== undefined) {
      abiEventInput.metaType = abiEventInputDto.metaType
    }
    await this.provider.get().save(abiEventInput)
    return abiEventInput
  }
}
