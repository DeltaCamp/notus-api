import { UseFilters, UseGuards, UnauthorizedException } from '@nestjs/common';
import { Resolver, ResolveProperty, Parent, Args, Query } from '@nestjs/graphql'

import {
  AbiEntity,
  AbiEventEntity,
  AbiEventInputEntity,
  UserEntity
} from '../entities'
import { AbiEventService } from './AbiEventService';
import { AbiService } from './AbiService';
import { GqlRollbarExceptionFilter } from '../filters/GqlRollbarExceptionFilter';
import { GqlAuthGuard } from '../auth/GqlAuthGuard';
import { Mutation } from 'type-graphql';
import { GqlAuthUser } from '../decorators/GqlAuthUser';
import { AbiEventDto } from './AbiEventDto'

const debug = require('debug')('notus:AbiEventResolver')

@UseFilters(new GqlRollbarExceptionFilter())
@Resolver(of => AbiEventEntity)
export class AbiEventResolver {

  constructor(
    private readonly abiService: AbiService,
    private readonly abiEventService: AbiEventService
  ) {}

  @Query(returns => AbiEventEntity)
  async abiEvent (
    @Args('id') id: number
  ) {
    return await this.abiEventService.findOneOrFail(id)
  }

  @Query(returns => [AbiEventEntity])
  async abiEvents (
    @Args({ name: 'name', type: () => String, nullable: true }) name: string,
    @Args({ name: 'topic', type: () => String, nullable: true }) topic: string) {
    return await this.abiEventService.find(name, topic)
  }
  
  @ResolveProperty('abi')
  async abi(@Parent() abiEvent: AbiEventEntity): Promise<AbiEntity> {
    return await this.abiService.findOneOrFail(abiEvent.abiId)
  }

  @ResolveProperty('abiEventInputs')
  async abiEventInputs(@Parent() abiEvent: AbiEventEntity): Promise<AbiEventInputEntity[]> {
    const result = await this.abiEventService.findAbiEventInputs(abiEvent)
    debug(`abiEventInputs: ${abiEvent.id}: `, result.length)
    return result
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => AbiEventEntity)
  @UseFilters(new GqlRollbarExceptionFilter())
  async updateAbiEvent(
    @GqlAuthUser() user: UserEntity,
    @Args('abiEvent') abiEventDto: AbiEventDto
  ): Promise<AbiEventEntity> {
    const abiEvent = await this.abiEventService.findOneOrFail(abiEventDto.id)
    if (abiEvent.abi.ownerId !== user.id) {
      throw new UnauthorizedException()
    }
    const event = await this.abiEventService.update(abiEvent, abiEventDto)
    return event
  }
}
