import { Injectable } from '@nestjs/common'
import { validate } from 'class-validator'
import { getAddress } from 'ethers/utils'

import {
  ContractEntity,
  UserEntity
} from '../entities'
import { notDefined } from '../utils/notDefined';
import { ContractDto } from './ContractDto'
import { AbiService } from '../abis/AbiService';
import { ContractsQuery } from './ContractsQuery';
import { ValidationException } from '../common/ValidationException';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { Service } from '../Service';

const debug = require('debug')('notus:ContractService')

@Injectable()
export class ContractService extends Service {

  constructor (
    private readonly abiService: AbiService,
    @InjectConnection()
    connection: Connection
  ) {
    super(connection)
  }

  async findAndCount(params: ContractsQuery, userId: number): Promise<[ContractEntity[], number]> {
    let query = await this.connection.createQueryBuilder(ContractEntity, 'contracts')
      .leftJoinAndSelect("contracts.abi", "abis")
      .leftJoinAndSelect("abis.abiEvents", "abiEvents")
    
    query = query.where('"contracts"."deletedAt" IS NULL')
    
    params = params || new ContractsQuery()

    if (params.hasAbiEvents) {
      query = query.andWhere('"contracts"."abiId" IN (SELECT "abi_events"."abiId" FROM abi_events GROUP BY "abi_events"."abiId" HAVING COUNT(*) > 0)')
    }
    
    if (params.ownerId) {
      query = query.andWhere('("contracts"."isPublic" IS TRUE AND "contracts"."ownerId" = :id)', { id: params.ownerId })
    } else {
      query = query.andWhere('("contracts"."isPublic" IS TRUE OR "contracts"."ownerId" = :id)', { id: userId })
    }

    if (params.networkId) {
      query = query.andWhere('"contracts"."networkId" = :networkId', { networkId: params.networkId })
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

    return query.printSql().orderBy('"contracts"."createdAt"', 'DESC').getManyAndCount()
  }

  async findOneOrFail(id: number): Promise<ContractEntity> {
    if (notDefined(id)) { throw new Error('id must be defined') }
    return await this.manager().findOneOrFail(ContractEntity, id)
  }

  async createContract(user: UserEntity, contractDto: ContractDto): Promise<ContractEntity> {

    const contract = new ContractEntity()
    contract.owner = user
    contract.name = contractDto.name
    contract.address = contractDto.address
    contract.abi = await this.abiService.findOrCreate(user, contractDto.abi)
    contract.networkId = contractDto.networkId
    contract.isPublic = contractDto.isPublic

    await this.validate(contract)

    contract.address = getAddress(contract.address)

    await this.manager().save(contract)

    return contract
  }
  
  async updateAndSave(contract: ContractEntity, contractDto: ContractDto): Promise<ContractEntity> {
    if (contractDto.name !== undefined) {
      contract.name = contractDto.name
    }

    if (contractDto.address !== undefined) {
      contract.address = contractDto.address
    }

    if (contractDto.networkId !== undefined) {
      contract.networkId = contractDto.networkId
    }

    if (contractDto.isPublic !== undefined) {
      contract.isPublic = contractDto.isPublic
    }

    await this.validate(contract)

    contract.address = getAddress(contract.address)

    await this.manager().save(contract)

    return contract
  }

  async destroy(contract: ContractEntity) {
    await this.manager().delete(ContractEntity, contract.id)
  }

  async validate(contract: ContractEntity) {
    const errors = await validate(contract)

    if (!(contract.abi || contract.abiId)) {
      errors.push({
        target: contract,
        property: 'abi',
        value: contract.abi,
        constraints: {
            'abi': `Must have an abi`
        },
        children: []
      })
    }

    if (errors.length > 0) {
      throw new ValidationException(`Contract is invalid`, errors)
    }
  }
}