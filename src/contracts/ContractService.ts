import { Injectable } from '@nestjs/common'
import { validate } from 'class-validator'
import { getAddress } from 'ethers/utils'

import { ClassValidationError } from '../ClassValidationError'
import {
  ContractEntity,
  UserEntity
} from '../entities'
import { Transaction, EntityManagerProvider } from '../transactions'
import { notDefined } from '../utils/notDefined';
import { ContractDto } from './ContractDto'
import { AbiService } from '../abis/AbiService';
import { ContractsQuery } from './ContractsQuery';

const debug = require('debug')('notus:ContractService')

@Injectable()
export class ContractService {

  constructor (
    private readonly provider: EntityManagerProvider,
    private readonly abiService: AbiService
  ) {}

  @Transaction()
  async findAndCount(params: ContractsQuery): Promise<[ContractEntity[], number]> {
    let query = await this.provider.get().createQueryBuilder(ContractEntity, 'contracts')
    
    query = query.where('"contracts"."deletedAt" IS NULL')
    
    if (params) {
      if (params.userId) {
        query = query.andWhere('"contracts"."userId" = :id', { id: params.userId })
      }
      if (params.address) {
        query = query.andWhere('"contracts"."address" ILIKE :address', { address: params.address })
      }
      if (params.name) {
        query = query.andWhere('"contracts"."name" ILIKE :name', { name: params.name })
      }

      if (params.skip) {
        query = query.offset(params.skip)
      }
      if (params.take) {
        query = query.limit(params.take)
      }
    }

    return query.printSql().orderBy('"contracts"."createdAt"', 'DESC').getManyAndCount()
  }

  @Transaction()
  async findOneOrFail(id: number): Promise<ContractEntity> {
    if (notDefined(id)) { throw new Error('id must be defined') }
    return await this.provider.get().findOneOrFail(ContractEntity, id)
  }

  @Transaction()
  async createContract(user: UserEntity, contractDto: ContractDto): Promise<ContractEntity> {
    const contract = new ContractEntity()
    contract.owner = user
    contract.name = contractDto.name
    contract.address = contractDto.address
    contract.abi = await this.abiService.findOrCreate(user, contractDto.abi)

    await this.validate(contract)

    contract.address = getAddress(contract.address)

    await this.provider.get().save(contract)

    return contract
  }
  
  @Transaction()
  async updateAndSave(contract: ContractEntity, contractDto: ContractDto): Promise<ContractEntity> {
    if (contractDto.name !== undefined) {
      contract.name = contractDto.name
    }

    if (contractDto.address !== undefined) {
      contract.address = contractDto.address
    }

    await this.validate(contract)

    contract.address = getAddress(contract.address)

    await this.provider.get().save(contract)

    return contract
  }

  @Transaction()
  async destroy(contract: ContractEntity) {
    await this.provider.get().delete(ContractEntity, contract.id)
  }

  async validate(contract: ContractEntity) {
    const errors = await validate(contract)
    if (errors.length) {
      throw new ClassValidationError(errors)
    }
  }
}