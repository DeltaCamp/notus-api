import { UseGuards, UnauthorizedException, UseFilters } from '@nestjs/common'
import { Resolver, ResolveProperty, Parent, Mutation, Args, Query } from '@nestjs/graphql'

import { GqlAuthGuard } from '../auth/GqlAuthGuard'
import { GqlAuthUser } from '../decorators/GqlAuthUser'
import {
  AbiEntity,
  ContractEntity,
  UserEntity
} from '../entities'
import { ContractDto } from './ContractDto'
import { ContractService } from './ContractService'
import { ContractsQuery } from './ContractsQuery'
import { ContractsQueryResponse } from './ContractsQueryResponse'

const debug = require('debug')('notus:ContractResolver')
import { GqlRollbarExceptionFilter } from '../filters/GqlRollbarExceptionFilter';
import { AbiService } from '../abis/AbiService';
import { UserService } from '../users/UserService';

@UseFilters(new GqlRollbarExceptionFilter())
@Resolver(of => ContractEntity)
export class ContractResolver {

  constructor(
    private readonly contractService: ContractService,
    private readonly abiService: AbiService,
    private readonly userService: UserService
  ) {}

  @Query(returns => ContractEntity)
  async contract(
    @Args('id') id: number) {
    return await this.contractService.findOneOrFail(id)
  }

  @UseGuards(GqlAuthGuard)
  @Query(returns => ContractsQueryResponse)
  async contracts(
    @GqlAuthUser() user: UserEntity,
    @Args({
      name: 'contractsQuery', type: () => ContractsQuery, nullable: true
    }) contractsQuery: ContractsQuery
  ): Promise<ContractsQueryResponse> {
    const result = new ContractsQueryResponse()
    if (!contractsQuery) {
      contractsQuery = new ContractsQuery()
    }
    const [contracts, totalCount] = await this.contractService.findAndCount(contractsQuery, user.id);
    result.contracts = contracts
    result.totalCount = totalCount
    result.skip = contractsQuery.skip
    result.take = contractsQuery.take
    return result
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => ContractEntity)
  async createContract(
    @GqlAuthUser() user: UserEntity,
    @Args('contract') contractDto: ContractDto
  ): Promise<ContractEntity> {
    contractDto = this.contractService.checkUnauthorizedFields(contractDto, user)
    return await this.contractService.createContract(user, contractDto)
  }

  @ResolveProperty('owner')
  async owner(
    @Parent() contract: ContractEntity
  ): Promise<UserEntity> {
    return await this.userService.findOneOrFail(contract.ownerId)
  }

  @ResolveProperty('abi')
  async abi(
    @Parent() contract: ContractEntity
  ): Promise<AbiEntity> {
    return await this.abiService.findOneOrFail(contract.abiId)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => ContractEntity)
  async updateContract(
    @GqlAuthUser() user: UserEntity,
    @Args('contract') contractDto: ContractDto
  ): Promise<ContractEntity> {
    contractDto = this.contractService.checkUnauthorizedFields(contractDto, user)
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
