import { UseFilters, UseGuards, UnauthorizedException } from '@nestjs/common';
import { Resolver, ResolveProperty, Parent, Args, Query, Mutation } from '@nestjs/graphql'

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
import { GqlAuthUser } from '../decorators/GqlAuthUser';
import { AbiEventDto } from './AbiEventDto'
import { AbiEventsQuery } from './AbiEventsQuery'
import { AbiEventsQueryResponse } from './AbiEventsQueryResponse';

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

  @Query(returns => AbiEventsQueryResponse)
  async abiEvents (
    @Args({
      name: 'abiEventsQuery',
      type: () => AbiEventsQuery, nullable: true
    }) abiEventsQuery: AbiEventsQuery): Promise<AbiEventsQueryResponse> {
    const result = new AbiEventsQueryResponse()
    const [abiEvents, totalCount] = await this.abiEventService.findAndCount(abiEventsQuery);

    result.abiEvents = abiEvents
    result.totalCount = totalCount

    if (abiEventsQuery) {
      result.skip = abiEventsQuery.skip
      result.take = abiEventsQuery.take
    }

    return result
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
  async updateAbiEvent(
    @GqlAuthUser() user: UserEntity,
    @Args('abiEvent') abiEventDto: AbiEventDto
  ): Promise<AbiEventEntity> {
    const abiEvent = await this.abiEventService.findOneOrFail(abiEventDto.id)

    if ((await this.getAbi(abiEvent)).ownerId !== user.id) {
      throw new UnauthorizedException()
    }
    const event = await this.abiEventService.update(abiEvent, abiEventDto)
    return event
  }

  async getAbi(abiEvent: AbiEventEntity): Promise<AbiEntity> {
    if (abiEvent.abi) {
      return abiEvent.abi
    } else {
      return this.abiService.findOneOrFail(abiEvent.abiId)
    }
  }
}
