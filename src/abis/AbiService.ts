import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Validator } from 'jsonschema'
import { Like, Connection, EntityManager } from 'typeorm'
import { validate } from 'class-validator'

import { AbiDto } from './AbiDto'
import { AbisQuery } from './AbisQuery'
import {
  AbiEntity,
  AbiEventEntity,
  AbiEventInputEntity,
  UserEntity
} from '../entities'
import { notDefined } from '../utils/notDefined';
import { AbiEventService } from './AbiEventService';
import { ValidationException } from '../common/ValidationException';
import { InjectConnection } from '@nestjs/typeorm';
import { Service } from '../Service';

const schema = require('../../abi.spec.json')

const debug = require('debug')('notus:AbiService')

@Injectable()
export class AbiService extends Service {

  constructor (
    @InjectConnection()
    connection: Connection,
    private readonly abiEventService: AbiEventService
  ) {
    super(connection)
  }

  checkUnauthorizedFields(abiDto: AbiDto, user: UserEntity): AbiDto {
    if (!user.isPaid() && abiDto.isPublic === false) {
      throw new UnauthorizedException('Only paid users can make their ABIs private')
    }
    return abiDto
  }

  async find(name: String): Promise<AbiEntity[]> {
    const criteria: any = {}
    if (name) {
      criteria.name = Like(`%${name}%`)
    }
    return await this.manager().find(AbiEntity, criteria)
  }

  async findOneOrFail(id: number): Promise<AbiEntity> {
    if (notDefined(id)) { throw new Error('id must be defined') }
    return await this.manager().findOneOrFail(AbiEntity, id)
  }

  async findOrCreate(user: UserEntity, abiDto: AbiDto): Promise<AbiEntity> {
    if (abiDto.id) {
      return this.findOneOrFail(abiDto.id)
    } else {
      return this.createAndSave(user, abiDto)
    }
  }

  // should have a way of scoping by user instead of just all abis:
  async findAndCount(params: AbisQuery) {
    let query = await this.manager().createQueryBuilder(AbiEntity, 'abis')

    if (params) {
      if (params.abiId) {
        query = query.andWhere('"abis"."abiId" = :id', { id: params.abiId })
      }
      if (params.skip) {
        query = query.offset(params.skip)
      }
      if (params.take) {
        query = query.limit(params.take)
      }
    }

    return query.printSql().orderBy('"abis"."name"', 'ASC').getManyAndCount()
  }

  async createAndSave(user: UserEntity, abiDto: AbiDto): Promise<AbiEntity> {
    const abi = await this.createAbi(abiDto)
    abi.owner = user
    await this.manager().save(abi)
    return abi
  }

  async updateAndSave(abi: AbiEntity, abiDto: AbiDto): Promise<AbiEntity> {
    if (abiDto.name !== undefined) {
      abi.name = abiDto.name
    }
    if (abiDto.isPublic !== undefined) {
      abi.isPublic = abiDto.isPublic || false
    }

    await this.validate(abi)

    await this.manager().save(abi)

    return abi
  }

  async destroy(abi: AbiEntity) {
    await this.transaction(async manager => {
      await Promise.all( (await this.findAbiEvents(abi)).map(abiEvent => (
        this.destroyAbiEvent(abiEvent, manager)
      )))
  
      await manager.delete(AbiEntity, abi.id)
    })
  }

  async destroyAbiEvent(abiEvent: AbiEventEntity, manager: EntityManager) {
    await Promise.all( (await this.findAbiEventInputs(abiEvent)).map(abiEventInput => (
      manager.delete(AbiEventInputEntity, abiEventInput.id)
    )))
    await manager.delete(AbiEventEntity, abiEvent.id)
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

    await this.transaction(async manager => {
      await manager.save(abi)

      let i
      for (i = 0; i < abiJson.length; i++) {
        const element = abiJson[i]
        if (element.type === 'event') {
          abi.abiEvents.push(await this.abiEventService.create(abi, element, manager))
        }
      }
    })

    return abi
  }

  async findAbiEvents(abi: AbiEntity): Promise<AbiEventEntity[]> {
    debug(`findAbiEvents: ${abi.id}: `)
    return await this.manager().createQueryBuilder(AbiEventEntity, 'abiEvent')
      .where('"abiEvent"."abiId" = :abiId', { abiId: abi.id })
      .getMany()
  }

  async findAbiEventInputs(abiEvent: AbiEventEntity): Promise<AbiEventInputEntity[]> {
    return await this.manager().find(AbiEventInputEntity, { abiEventId: abiEvent.id })
  }

  async validate(abi: AbiEntity) {
    const errors = await validate(abi)
    if (errors.length > 0) {
      throw new ValidationException(`ABI is invalid`, errors)
    }
  }
}