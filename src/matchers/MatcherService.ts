import { Injectable } from '@nestjs/common'

import {
  MatcherEntity,
  VariableEntity,
  EventTypeEntity
} from '../entities'
import {
  MatcherDto
} from './MatcherDto'
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
  async createMatcher(matcherDto: MatcherDto): Promise<MatcherEntity> {
    const variable = await this.variableService.findOneOrFail(matcherDto.variable.id)
    return this._createMatcher(matcherDto, variable)
  }

  @Transaction()
  async createMatcherWithVariable(eventType: EventTypeEntity, matcherDto): Promise<MatcherEntity> {
    let variable
    if (matcherDto.variable.id) {
      variable = await this.variableService.findOneOrFail(matcherDto.variable.id)
    } else {
      variable = await this.variableService.createVariable(eventType, matcherDto.variable)
    }
    return this._createMatcher(matcherDto, variable)
  }

  @Transaction()
  async _createMatcher(matcherDto, variable: VariableEntity): Promise<MatcherEntity> {
    const matcher = new MatcherEntity()

    matcher.variable = variable
    matcher.type = matcherDto.type
    matcher.operand = matcherDto.operand

    await this.provider.get().save(matcher)

    return matcher
  }

  @Transaction()
  async update(matcherDto: MatcherDto): Promise<MatcherEntity> {
    const matcher = await this.findOneOrFail(matcherDto.id)
    if (matcher.variableId !== matcherDto.variable.id) {
      matcher.variable = await this.variableService.findOneOrFail(matcherDto.variable.id)
    }
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
  async findOneOrFail(matcherId): Promise<MatcherEntity> {
    return await this.provider.get().findOneOrFail(MatcherEntity, matcherId)
  }

  @Transaction()
  async getVariable(matcher: MatcherEntity): Promise<VariableEntity> {
    return await this.variableService.findOneOrFail(matcher.variableId)
  }

  @Transaction()
  async destroy(matcherId: number) {
    await this.provider.get().delete(MatcherEntity, matcherId);
  }
}
