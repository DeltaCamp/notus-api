import { UseGuards, UnauthorizedException, UseFilters } from '@nestjs/common'
import { Resolver, ResolveProperty, Parent, Mutation, Args, Query } from '@nestjs/graphql'

import { GqlAuthGuard } from '../auth/GqlAuthGuard'
import { GqlAuthUser } from '../decorators/GqlAuthUser'
import {
  AbiEntity,
  AbiEventEntity,
  UserEntity
} from '../entities'
import { AbiDto } from './AbiDto'
import { AbiService } from './AbiService'

const debug = require('debug')('notus:AbiResolver')
import { GqlRollbarExceptionFilter } from '../filters/GqlRollbarExceptionFilter';

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

  @Query(returns => [AbiEntity])
  async abis(
    @Args({ name: 'name', type: () => String, nullable: true }) name: string) {
    return await this.abiService.find(name)
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
    return await this.abiService.createAndSave(user, abiDto)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => AbiEntity)
  async updateAbi(
    @GqlAuthUser() user: UserEntity,
    @Args('abi') abiDto: AbiDto
  ): Promise<AbiEntity> {
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
