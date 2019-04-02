import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'

import { MatcherEntity } from './MatcherEntity'
import { VariableService } from '../variables/VariableService'

@Injectable()
export class MatcherService {

  constructor (
    @InjectRepository(MatcherEntity)
    private readonly matcherRepository: Repository<MatcherEntity>,
    private readonly variableService: VariableService
  ) {}

  async createMatcher(matcherDto): Promise<MatcherEntity> {
    const matcher = new MatcherEntity()

    matcher.variable = await this.variableService.findOne(matcherDto.variableId)
    matcher.type = matcherDto.type
    matcher.operand = matcherDto.operand

    await this.matcherRepository.save(matcher)

    return matcher
  }
}
