import { Resolver, ResolveProperty, Parent, Mutation, Args, Query } from '@nestjs/graphql'

import {
  ContractEntity,
  ContractEventEntity,
  ContractEventInputEntity
} from '../entities'
import { ContractEventService } from './ContractEventService';
import { ContractService } from './ContractService';

const debug = require('debug')('notus:ContractEventResolver')

@Resolver(of => ContractEventEntity)
export class ContractEventResolver {

  constructor(
    private readonly contractService: ContractService,
    private readonly contractEventService: ContractEventService
  ) {}

  @Query(returns => [ContractEventEntity])
  async contractEvents (
    @Args({ name: 'name', type: () => String, nullable: true }) name: string,
    @Args({ name: 'topic', type: () => String, nullable: true }) topic: string) {
    return await this.contractEventService.find(name, topic)
  }
  
  @ResolveProperty('contract')
  async contract(@Parent() contractEvent: ContractEventEntity): Promise<ContractEntity> {
    return await this.contractService.findOneOrFail(contractEvent.contractId)
  }

  @ResolveProperty('contractEventInputs')
  async contractEventInputs(@Parent() contractEvent: ContractEventEntity): Promise<ContractEventInputEntity[]> {
    const result = await this.contractEventService.findContractEventInputs(contractEvent)
    debug(`contractEventInputs: ${contractEvent.id}: `, result.length)
    return result
  }
}
