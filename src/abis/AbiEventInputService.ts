import { Injectable } from '@nestjs/common'
import { validate, ValidationError } from 'class-validator'

import {
  AbiEventInputEntity,
  AbiEventEntity
} from '../entities'
import { ValidationException } from '../common/ValidationException'
import { notDefined } from '../utils/notDefined'
import { AbiEventInputDto } from './AbiEventInputDto';
import { SolidityDataType } from '../common/SolidityDataType';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, EntityManager } from 'typeorm';
import { Service } from '../Service';

@Injectable()
export class AbiEventInputService extends Service {

  constructor (
    @InjectConnection()
    connection: Connection
  ) {
    super(connection)
  }

  async findOneOrFail(id: number): Promise<AbiEventInputEntity> {
    if (notDefined(id)) { throw new Error('id must be defined') }
    return await this.manager().findOneOrFail(AbiEventInputEntity, id, { relations: ['abiEvent', 'abiEvent.abi' ]})
  }

  async findByNameAndAbiEventId(name: String, abiEventId: number): Promise<AbiEventInputEntity[]> {
    let query = await this.manager().createQueryBuilder(AbiEventInputEntity, 'abiEventInput')
      .where('"abiEventInput"."createdAt" IS NOT NULL')

    if (name !== undefined) {
      query = query.andWhere('"abiEventInput"."name" = :name', { name })
    }

    if (abiEventId !== undefined) {
      query = query.andWhere('"abiEventInput"."abiEventId" = :abiEventId', { abiEventId })
    }

    return query.getMany()
  }

  async create(abiEvent: AbiEventEntity, name: string, type: SolidityDataType, entityManager?: EntityManager): Promise<AbiEventInputEntity> {
    const abiEventInput = new AbiEventInputEntity()
    abiEventInput.name = name
    abiEventInput.title = name
    abiEventInput.type = type
    abiEventInput.abiEvent = abiEvent

    await this.validate(abiEventInput)

    this.transaction(async manager => {
      manager.save(abiEventInput)
    }, entityManager)

    return abiEventInput
  }

  async update(abiEventInput: AbiEventInputEntity, abiEventInputDto: AbiEventInputDto): Promise<AbiEventInputEntity> {
    if (abiEventInputDto.metaType !== undefined) {
      abiEventInput.metaType = abiEventInputDto.metaType
    }
    if (abiEventInputDto.title !== undefined) {
      abiEventInput.title = abiEventInputDto.title
    }

    await this.validate(abiEventInput)

    await this.manager().save(abiEventInput)
    return abiEventInput
  }

  async validate(abiEventInput: AbiEventInputEntity) {
    const errors: ValidationError[] = await validate(abiEventInput)

    if (errors.length > 0) {
      throw new ValidationException(`ABI Event Input is invalid`, errors)
    }
  }
}
