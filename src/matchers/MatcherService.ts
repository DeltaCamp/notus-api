import { Injectable } from '@nestjs/common'

import {
  MatcherEntity,
  EventEntity
} from '../entities'
import {
  MatcherDto
} from './MatcherDto'
import {
  Transaction,
  EntityManagerProvider
 } from '../transactions'
 import { AbiEventInputService } from '../abis/AbiEventInputService'

@Injectable()
export class MatcherService {

  constructor (
    private readonly provider: EntityManagerProvider,
    private readonly abiEventInputService: AbiEventInputService
  ) {}

  @Transaction()
  async createMatcher(event: EventEntity, matcherDto: MatcherDto): Promise<MatcherEntity> {
    const matcher = new MatcherEntity()

    matcher.event = event
    matcher.order = matcherDto.order
    matcher.source = matcherDto.source
    if (matcherDto.abiEventInputId) {
      matcher.abiEventInput = await this.abiEventInputService.findOneOrFail(matcherDto.abiEventInputId)
    }
    matcher.operator = matcherDto.operator
    matcher.operand = matcherDto.operand

    await this.provider.get().save(matcher)

    return matcher
  }

  @Transaction()
  async update(matcherDto: MatcherDto): Promise<MatcherEntity> {
    const matcher = await this.findOneOrFail(matcherDto.id)
    matcher.order = matcherDto.order
    matcher.source = matcherDto.source
    if (matcherDto.abiEventInputId) {
      matcher.abiEventInput = await this.abiEventInputService.findOneOrFail(matcherDto.abiEventInputId)
    }
    matcher.operator = matcherDto.operator
    matcher.operand = matcherDto.operand

    await this.provider.get().save(matcher)

    return matcher
  }

  @Transaction()
  async findOne(matcherId: number): Promise<MatcherEntity> {
    return await this.provider.get().findOne(MatcherEntity, matcherId)
  }

  @Transaction()
  async findOneOrFail(matcherId: number): Promise<MatcherEntity> {
    return await this.provider.get().findOneOrFail(MatcherEntity, matcherId)
  }

  @Transaction()
  async destroy(matcherId: number) {
    await this.provider.get().delete(MatcherEntity, matcherId);
  }
}
