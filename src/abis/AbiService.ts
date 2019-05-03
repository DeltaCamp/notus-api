import { Injectable } from '@nestjs/common'
import { Validator } from 'jsonschema'
import { Like } from 'typeorm'
import { validate } from 'class-validator'

import { ClassValidationError } from '../ClassValidationError'
import { AbiDto } from './AbiDto'
import {
  AbiEntity,
  AbiEventEntity,
  AbiEventInputEntity,
  UserEntity
} from '../entities'
import { Transaction, EntityManagerProvider } from '../transactions'
import { notDefined } from '../utils/notDefined';

const schema = require('../../abi.spec.json')

const debug = require('debug')('notus:AbiService')

@Injectable()
export class AbiService {

  constructor (
    private readonly provider: EntityManagerProvider
  ) {}

  @Transaction()
  async find(name: String): Promise<AbiEntity[]> {
    const criteria: any = {}
    if (name) {
      criteria.name = Like(`%${name}%`)
    }
    return await this.provider.get().find(AbiEntity, criteria)
  }

  @Transaction()
  async findOneOrFail(id: number): Promise<AbiEntity> {
    if (notDefined(id)) { throw new Error('id must be defined') }
    return await this.provider.get().findOneOrFail(AbiEntity, id)
  }

  @Transaction()
  async createAndSave(user: UserEntity, abiDto: AbiDto): Promise<AbiEntity> {
    const abi = await this.createAbi(abiDto)
    abi.owner = user
    await this.provider.get().save(abi)
    return abi
  }

  @Transaction()
  async updateAndSave(abi: AbiEntity, abiDto: AbiDto): Promise<AbiEntity> {
    if (abiDto.name !== undefined) {
      abi.name = abiDto.name
    }
    if (abiDto.isPublic !== undefined) {
      abi.isPublic = abiDto.isPublic || false
    }

    await this.validate(abi)

    await this.provider.get().save(abi)

    return abi
  }

  @Transaction()
  async destroy(abi: AbiEntity) {
    await Promise.all( (await this.findAbiEvents(abi)).map(abiEvent => (
      this.destroyAbiEvent(abiEvent)
    )))

    await this.provider.get().delete(AbiEntity, abi.id)
  }

  async destroyAbiEvent(abiEvent: AbiEventEntity) {
    await Promise.all( (await this.findAbiEventInputs(abiEvent)).map(abiEventInput => (
      this.provider.get().delete(AbiEventInputEntity, abiEventInput.id)
    )))
    await this.provider.get().delete(AbiEventEntity, abiEvent.id)
  }

  async createAbi(abiDto: AbiDto): Promise<AbiEntity> {
    const validator = new Validator()
    const abiJson = JSON.parse(abiDto.abi)
    const result = validator.validate(abiJson, schema)

    if (!result.valid) {
      throw new Error(`Invalid JSON: ${result.errors.join(', ')}`)
    }

    const abi = new AbiEntity()
    abi.name = abiDto.name
    abi.abi = abiDto.abi
    abi.isPublic = abiDto.isPublic || false
    abi.abiEvents = []

    await this.validate(abi)

    abiJson.forEach((element: any) => {
      if (element.type === 'event') {
        abi.abiEvents.push(this.createEvent(abi, element))
      }
    })

    return abi
  }

  createEvent(abi: AbiEntity, descriptor: any): AbiEventEntity {
    const abiEvent = new AbiEventEntity()
    abiEvent.name = descriptor.name
    abiEvent.topic = abi.interface().events[descriptor.name].topic
    abiEvent.abiEventInputs = descriptor.inputs.map((input: any) => {
      return this.createEventInput(input)
    })
    return abiEvent
  }

  createEventInput(input: any): AbiEventInputEntity {
    const abiEventInput = new AbiEventInputEntity()
    abiEventInput.name = input.name
    abiEventInput.type = input.type
    return abiEventInput
  }

  @Transaction()
  async findAbiEvents(abi: AbiEntity): Promise<AbiEventEntity[]> {
    debug(`findAbiEvents: ${abi.id}: `)
    return await this.provider.get()
      .createQueryBuilder(AbiEventEntity, 'abiEvent')
      .where('"abiEvent"."abiId" = :abiId', { abiId: abi.id })
      .getMany()
  }

  async findAbiEventInputs(abiEvent: AbiEventEntity): Promise<AbiEventInputEntity[]> {
    return await this.provider.get().find(AbiEventInputEntity, { abiEventId: abiEvent.id })
  }

  async validate(abi: AbiEntity) {
    const errors = await validate(abi)
    if (errors.length) {
      throw new ClassValidationError(errors)
    }
  }
}