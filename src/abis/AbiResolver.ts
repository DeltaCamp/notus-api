import {
  UseGuards,
  UnauthorizedException,
  UseFilters
} from '@nestjs/common'
import { Resolver,
  ResolveProperty,
  Parent,
  Mutation,
  Args,
  Query
} from '@nestjs/graphql'
import { getAddress } from 'ethers/utils'

import { GqlAuthGuard } from '../auth/GqlAuthGuard'
import { GqlAuthUser } from '../decorators/GqlAuthUser'
import {
  AbiEntity,
  AbiEventEntity,
  UserEntity
} from '../entities'
import { AbiDto } from './AbiDto'
import { AbiService } from './AbiService'
import { AbisQuery } from './AbisQuery';
import { AbisQueryResponse } from './AbisQueryResponse';

import { GqlRollbarExceptionFilter } from '../filters/GqlRollbarExceptionFilter';
import { EtherscanAbiEntity } from './EtherscanAbiEntity';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { ValidationException } from '../common/ValidationException';

const axios = require('axios')
const debug = require('debug')('notus:AbiResolver')

const ETHERSCAN_API_URL_MAP = {
  1: 'https://api.etherscan.io',
  3: 'https://api-ropsten.etherscan.io',
  4: 'https://api-rinkeby.etherscan.io',
  5: 'https://api-goerli.etherscan.io',
  42: 'https://api-kovan.etherscan.io',
};

@UseFilters(new GqlRollbarExceptionFilter())
@Resolver(of => AbiEntity)
export class AbiResolver {

  constructor(
    private readonly abiService: AbiService
  ) {}

  @Query(returns => AbiEntity)
  async abi(
    @Args('id') id: number) {
    return await this.abiService.findOneOrFail(id)
  }

  // @Query(returns => [AbiEntity])
  // async abis(
  //   @Args({ name: 'name', type: () => String, nullable: true }) name: string) {
  //   return await this.abiService.find(name)
  // }

  @Query(returns => AbisQueryResponse)
  async abis(
    @Args({
      name: 'abisQuery',
      type: () => AbisQuery, nullable: true
    }) abisQuery: AbisQuery): Promise<AbisQueryResponse> {

    const result = new AbisQueryResponse()
    const [abis, totalCount] = await this.abiService.findAndCount(abisQuery);

    result.abis = abis
    result.totalCount = totalCount

    if (abisQuery) {
      result.skip = abisQuery.skip
      result.take = abisQuery.take
    }

    return result
  }

  @ResolveProperty('abiEvents')
  async abiEvents(@Parent() abi: AbiEntity): Promise<AbiEventEntity[]> {
    const abiEvents = await this.abiService.findAbiEvents(abi)
    debug(`abiEvents: ${abi.id}:`, abiEvents.length)
    return abiEvents
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => AbiEntity)
  async createAbi(
    @GqlAuthUser() user: UserEntity,
    @Args('abi') abiDto: AbiDto
  ): Promise<AbiEntity> {
    if (!user.isAdmin) {
      throw new UnauthorizedException()
    }
    abiDto = this.abiService.checkUnauthorizedFields(abiDto, user)
    return await this.abiService.createAndSave(user, abiDto)
  }

  @UseGuards(GqlAuthGuard)
  @Query(returns => EtherscanAbiEntity)
  async etherscanAbi(
    @GqlAuthUser() user: UserEntity,
    @Args('address') address: string,
    @Args({ name: 'networkId', type: () => Number, nullable: true }) networkId: number
  ): Promise<EtherscanAbiEntity> {
    let parsedAddress
    try {
      parsedAddress = getAddress(address)
    } catch (error) {
      throw new ValidationException("Not a valid address", [])
    }

    const url = `${ETHERSCAN_API_URL_MAP[networkId || 1]}/api?module=contract&action=getabi&address=${parsedAddress}&apikey=${user.etherscan_api_key}`
    const response = await axios.get(url)
    return response.data
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => AbiEntity)
  async updateAbi(
    @GqlAuthUser() user: UserEntity,
    @Args('abi') abiDto: AbiDto
  ): Promise<AbiEntity> {
    abiDto = this.abiService.checkUnauthorizedFields(abiDto, user)
    const abi = await this.abiService.findOneOrFail(abiDto.id)
    if (abi.ownerId !== user.id) {
      throw new UnauthorizedException()
    }
    return await this.abiService.updateAndSave(abi, abiDto)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => AbiEntity)
  async destroyAbi(
    @GqlAuthUser() user: UserEntity,
    @Args('id') id: number
  ): Promise<AbiEntity> {
    const abi = await this.abiService.findOneOrFail(id)
    if (abi.ownerId !== user.id) {
      throw new UnauthorizedException()
    }
    await this.abiService.destroy(abi)
    return abi
  }
}
