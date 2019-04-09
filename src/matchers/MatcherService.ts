import { Injectable } from '@nestjs/common'

import {
  MatcherEntity,
  VariableEntity
} from '../entities'
import {
  VariableService
} from '../variables/VariableService'
import {
  Transaction,
  EntityManagerProvider
 } from '../typeorm'

@Injectable()
export class MatcherService {

  constructor (
    private readonly provider: EntityManagerProvider,
    private readonly variableService: VariableService
  ) {}

  @Transaction()
  async createMatcher(matcherDto): Promise<MatcherEntity> {
    const matcher = new MatcherEntity()

    matcher.variable = await this.variableService.findOne(matcherDto.variableId)
    matcher.type = matcherDto.type
    matcher.operand = matcherDto.operand

    await this.provider.get().save(matcher)

    return matcher
  }

  @Transaction()
  async findOne(matcherId): Promise<MatcherEntity> {
    return await this.provider.get().findOne(MatcherEntity, matcherId)
  }

  @Transaction()
  async getVariable(matcher: MatcherEntity): Promise<VariableEntity> {
    return await this.variableService.findOne(matcher.variableId)
  }

  @Transaction()
  async destroy(matcherId: number) {
    await this.provider.get().delete(MatcherEntity, matcherId);
  }
}
