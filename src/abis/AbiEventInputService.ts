import { Injectable } from '@nestjs/common'
import { validate, Validator } from 'jsonschema'
import { Like } from 'typeorm'

import { AbiDto } from './AbiDto'
import {
  AbiEntity,
  AbiEventInputEntity
} from '../entities'
import { Transaction, EntityManagerProvider } from '../transactions'
import { description } from 'joi';

const schema = require('../../abi.spec.json')

@Injectable()
export class AbiEventInputService {

  constructor (
    private readonly provider: EntityManagerProvider
  ) {}

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