import { UseGuards, UnauthorizedException } from '@nestjs/common'
import { Resolver, ResolveProperty, Parent, Mutation, Args, Query } from '@nestjs/graphql'

import { GqlAuthGuard } from '../auth/GqlAuthGuard'
import { GqlAuthUser } from '../decorators/GqlAuthUser'
import {
  ContractEntity,
  ContractEventEntity,
  UserEntity
} from '../entities'
import { ContractDto } from './ContractDto'
import { ContractService } from './ContractService'

const debug = require('debug')('notus:ContractResolver')

@Resolver(of => ContractEntity)
export class ContractResolver {

  constructor(
    private readonly contractService: ContractService
  ) {}

  @Query(returns => ContractEntity)
  async contract(
    @Args('id') id: number) {
    return await this.contractService.findOneOrFail(id)
  }

  @Query(returns => [ContractEntity])
  async contracts(
    @Args({ name: 'name', type: () => String, nullable: true }) name: string,
    @Args({ name: 'address', type: () => String, nullable: true }) address: string) {
    return await this.contractService.findByNameAndAddress(name, address)
  }

  @ResolveProperty('contractEvents')
  async contractEvents(@Parent() contract: ContractEntity): Promise<ContractEventEntity[]> {
    const contractEvents = await this.contractService.findContractEvents(contract)
    debug(`contractEvents: ${contract.id}:`, contractEvents.length)
    return contractEvents
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => ContractEntity)
  async createContract(
    @GqlAuthUser() user: UserEntity,
    @Args('contract') contractDto: ContractDto
  ): Promise<ContractEntity> {
    return await this.contractService.createAndSave(user, contractDto)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => ContractEntity)
  async updateContract(
    @GqlAuthUser() user: UserEntity,
    @Args('contract') contractDto: ContractDto
  ): Promise<ContractEntity> {
    const contract = await this.contractService.findOneOrFail(contractDto.id)
    if (contract.ownerId !== user.id) {
      throw new UnauthorizedException()
    }
    return await this.contractService.updateAndSave(contract, contractDto)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => ContractEntity)
  async destroyContract(
    @GqlAuthUser() user: UserEntity,
    @Args('id') id: number
  ): Promise<ContractEntity> {
    const contract = await this.contractService.findOneOrFail(id)
    if (contract.ownerId !== user.id) {
      throw new UnauthorizedException()
    }
    await this.contractService.destroy(contract)
    return contract
  }
}
