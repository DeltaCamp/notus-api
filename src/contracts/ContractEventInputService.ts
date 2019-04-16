import { Injectable } from '@nestjs/common'
import { validate, Validator } from 'jsonschema'
import { Like } from 'typeorm'

import { ContractDto } from './ContractDto'
import {
  ContractEntity,
  ContractEventInputEntity
} from '../entities'
import { Transaction, EntityManagerProvider } from '../transactions'
import { description } from 'joi';

const schema = require('../../abi.spec.json')

@Injectable()
export class ContractEventInputService {

  constructor (
    private readonly provider: EntityManagerProvider
  ) {}

  @Transaction()
  async findByNameAndContractEventId(name: String, contractEventId: number): Promise<ContractEventInputEntity[]> {
    let query = await this.provider.get().createQueryBuilder(ContractEventInputEntity, 'contractEventInput')

    if (name !== undefined) {
      query = query.where('"contractEventInput"."name" = :name', { name })
    }

    if (contractEventId !== undefined) {
      query = query.where('"contractEventInput"."contractEventId" = :contractEventId', { contractEventId })
    }

    return query.getMany()
  }
}