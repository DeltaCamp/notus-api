import { Resolver, ResolveProperty, Parent, Mutation, Args, Query } from '@nestjs/graphql'

import {
  ContractEntity,
  ContractEventEntity,
  ContractEventInputEntity
} from '../entities'
import { ContractEventInputService } from './ContractEventInputService'
import { ContractEventService } from './ContractEventService'

@Resolver(of => ContractEventInputEntity)
export class ContractEventInputResolver {

  constructor(
    private readonly contractEventInputService: ContractEventInputService,
    private readonly contractEventService: ContractEventService
  ) {}

  @Query(returns => [ContractEventInputEntity])
  async contractEventInputs (
    @Args({ name: 'name', type: () => String, nullable: true }) name: string,
    @Args({ name: 'contractEventId', type: () => Number, nullable: true }) contractEventId: number): Promise<ContractEventInputEntity[]> {
    return await this.contractEventInputService.findByNameAndContractEventId(name, contractEventId)
  }

  @ResolveProperty('contractEvent')
  async contractEvent(@Parent() contractEventInput: ContractEventInputEntity): Promise<ContractEventEntity> {
    return await this.contractEventService.findOneOrFail(contractEventInput.contractEventId)
  }
}
