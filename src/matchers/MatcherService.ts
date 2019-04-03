import { Injectable } from '@nestjs/common'

import { MatcherEntity } from './MatcherEntity'
import { VariableService } from '../variables/VariableService'
import { Transaction } from '../typeorm/Transaction'
import { EntityManagerProvider } from '../typeorm/EntityManagerProvider'

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
}
