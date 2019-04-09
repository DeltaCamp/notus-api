import { UseGuards, UnauthorizedException } from '@nestjs/common'
import { Resolver, ResolveProperty, Parent, Mutation } from '@nestjs/graphql'

import {
  VariableEntity,
  MatcherEntity
} from '../entities'
import { MatcherService } from './MatcherService'

const debug = require('debug')('notus:MatcherResolver')

@Resolver(of => MatcherEntity)
export class MatcherResolver {

  constructor(
    private readonly matcherService: MatcherService
  ) {}

  @ResolveProperty('variable')
  async variable(@Parent() matcher: MatcherEntity): Promise<VariableEntity> {
    return await this.matcherService.getVariable(matcher)
  }
}
