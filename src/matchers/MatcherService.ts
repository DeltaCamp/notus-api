import { Injectable } from '@nestjs/common'

import {
  MatcherEntity,
  EventEntity,
  AbiEventInputEntity
} from '../entities'
import {
  MatcherDto
} from './MatcherDto'
import {
  Transaction,
  EntityManagerProvider
 } from '../transactions'
import { AbiEventInputService } from '../abis/AbiEventInputService'
import * as Source from './Source'
import { Operator } from './Operator'
import { SolidityDataType } from '../common/SolidityDataType';
import { SourceDataType } from './SourceDataType';
import { validateOperand } from './validateOperand'
import { ValidationException } from '../common/ValidationException'
import { validate } from 'class-validator'
import { notDefined } from '../utils/notDefined';

@Injectable()
export class MatcherService {

  constructor (
    private readonly provider: EntityManagerProvider,
    private readonly abiEventInputService: AbiEventInputService
  ) {}

  @Transaction()
  async createOrUpdate(event: EventEntity, matcherDto: MatcherDto): Promise<MatcherEntity> {
    if (matcherDto.id) {
      return await this.update(matcherDto)
    } else {
      return await this.createMatcher(event, matcherDto)
    }
  }

  @Transaction()
  async createMatcher(event: EventEntity, matcherDto: MatcherDto): Promise<MatcherEntity> {
    const matcher = new MatcherEntity()

    matcher.event = event

    matcher.order = matcherDto.order
    matcher.source = matcherDto.source
    matcher.operator = matcherDto.operator
    matcher.operand = matcherDto.operand
    
    if (matcherDto.abiEventInputId) {
      matcher.abiEventInput = await this.abiEventInputService.findOneOrFail(matcherDto.abiEventInputId)
    }

    await this.validateMatcher(matcher)

    await this.provider.get().save(matcher)

    return matcher
  }

  @Transaction()
  async update(matcherDto: MatcherDto): Promise<MatcherEntity> {
    const matcher = await this.findOneOrFail(matcherDto.id)

    new Array(
      'order',
      'source',
      'operator',
      'operand'
    ).forEach(attr => {
      if (matcherDto[attr] !== undefined) {
        matcher[attr] = matcherDto[attr]
      }
    })

    if (matcherDto.abiEventInputId !== undefined) {
      if (matcherDto.abiEventInputId !== null) {
        matcher.abiEventInput = await this.abiEventInputService.findOneOrFail(matcherDto.abiEventInputId)
      } else {
        matcher.abiEventInput = null
      }
    }

    await this.validateMatcher(matcher)

    await this.provider.get().save(matcher)

    return matcher
  }

  async validateMatcher(matcher: MatcherEntity) {
    let errors = []

    if (matcher.operator !== Operator.NOOP && matcher.operand !== '') {
      const dataType: SolidityDataType = await this.getDataType(matcher)
      try {
        validateOperand(dataType, matcher.operand)
      } catch (error) {
        errors.push({
          target: matcher,
          property: 'operand',
          value: matcher.operand,
          constraints: {
            DataTypeFormat: dataType
          }
        })
      }
    }
    errors = errors.concat(await validate(matcher))
    if (errors.length > 0) {
      throw new ValidationException(`Matcher is invalid`, errors)
    }
  }

  async getDataType(matcher: MatcherEntity): Promise<SolidityDataType> {
    if (matcher.source === Source.CONTRACT_EVENT_INPUT) {
      if (matcher.abiEventInput) {
        return matcher.abiEventInput.type        
      } else {
        const abiEventInput = await this.provider.get().findOneOrFail(AbiEventInputEntity, matcher.abiEventInputId)
        return abiEventInput.type
      }
    } else {
      return SourceDataType[matcher.source]
    }
  }

  @Transaction()
  async findOne(matcherId: number): Promise<MatcherEntity> {
    return await this.provider.get().findOne(MatcherEntity, matcherId)
  }

  @Transaction()
  async findOneOrFail(matcherId: number): Promise<MatcherEntity> {
    if (notDefined(matcherId)) { throw new Error(`id must be defined`) }
    return await this.provider.get().findOneOrFail(MatcherEntity, matcherId)
  }

  @Transaction()
  async destroy(matcherId: number) {
    await this.provider.get().delete(MatcherEntity, matcherId);
  }
}
