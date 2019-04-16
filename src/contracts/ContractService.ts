import { Injectable } from '@nestjs/common'
import { validate, Validator } from 'jsonschema'
import { Like } from 'typeorm'

import { ContractDto } from './ContractDto'
import {
  ContractEntity,
  ContractEventEntity,
  ContractEventInputEntity,
  UserEntity
} from '../entities'
import { Transaction, EntityManagerProvider } from '../transactions'

const schema = require('../../abi.spec.json')

const debug = require('debug')('notus:ContractService')

@Injectable()
export class ContractService {

  constructor (
    private readonly provider: EntityManagerProvider
  ) {}

  @Transaction()
  async findByNameAndAddress(name: String, address: String): Promise<ContractEntity[]> {
    const criteria: any = {}
    if (name) {
      criteria.name = Like(`%${name}%`)
    }
    if (address) {
      criteria.address = address
    }
    return await this.provider.get().find(ContractEntity, criteria)
  }

  @Transaction()
  async findOneOrFail(id: number): Promise<ContractEntity> {
    return await this.provider.get().findOneOrFail(ContractEntity, id)
  }

  @Transaction()
  async createAndSave(user: UserEntity, contractDto: ContractDto): Promise<ContractEntity> {
    const contract = await this.createContract(contractDto)
    contract.owner = user
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
    if (contractDto.isPublic !== undefined) {
      contract.isPublic = contractDto.isPublic || false
    }

    await this.provider.get().save(contract)

    return contract
  }

  @Transaction()
  async destroy(contract: ContractEntity) {
    await Promise.all( (await this.findContractEvents(contract)).map(contractEvent => (
      this.destroyContractEvent(contractEvent)
    )))

    await this.provider.get().delete(ContractEntity, contract.id)
  }

  async destroyContractEvent(contractEvent: ContractEventEntity) {
    await Promise.all( (await this.findContractEventInputs(contractEvent)).map(contractEventInput => (
      this.provider.get().delete(ContractEventInputEntity, contractEventInput.id)
    )))
    await this.provider.get().delete(ContractEventEntity, contractEvent.id)
  }

  async createContract(contractDto: ContractDto): Promise<ContractEntity> {
    const validator = new Validator()
    const abi = JSON.parse(contractDto.abi)
    const result = validator.validate(abi, schema)

    if (!result.valid) {
      throw new Error('Invalid JSON')
    }

    const contract = new ContractEntity()
    contract.name = contractDto.name
    contract.address = contractDto.address
    contract.abi = contractDto.abi
    contract.isPublic = contractDto.isPublic || false
    contract.contractEvents = []

    abi.forEach((element: any) => {
      if (element.type === 'event') {
        contract.contractEvents.push(this.createEvent(contract, element))
      }
    })

    return contract
  }

  createEvent(contract: ContractEntity, descriptor: any): ContractEventEntity {
    const contractEvent = new ContractEventEntity()
    contractEvent.name = descriptor.name
    contractEvent.topic = contract.interface().events[descriptor.name].topic
    contractEvent.contractEventInputs = descriptor.inputs.map((input: any) => {
      return this.createEventInput(input)
    })
    return contractEvent
  }

  createEventInput(input: any): ContractEventInputEntity {
    const contractEventInput = new ContractEventInputEntity()
    contractEventInput.name = input.name
    contractEventInput.type = input.type
    return contractEventInput
  }

  @Transaction()
  async findContractEvents(contract: ContractEntity): Promise<ContractEventEntity[]> {
    debug(`findContractEvents: ${contract.id}: `)
    return await this.provider.get()
      .createQueryBuilder(ContractEventEntity, 'contractEvent')
      .where('"contractEvent"."contractId" = :contractId', { contractId: contract.id })
      .getMany()
  }

  async findContractEventInputs(contractEvent: ContractEventEntity): Promise<ContractEventInputEntity[]> {
    return await this.provider.get().find(ContractEventInputEntity, { contractEventId: contractEvent.id })
  }
}