import { Resolver, ResolveProperty, Parent, Mutation, Args, Query } from '@nestjs/graphql'

import {
  AbiEntity,
  AbiEventEntity,
  AbiEventInputEntity
} from '../entities'
import { AbiEventService } from './AbiEventService';
import { AbiService } from './AbiService';

const debug = require('debug')('notus:AbiEventResolver')

@Resolver(of => AbiEventEntity)
export class AbiEventResolver {

  constructor(
    private readonly abiService: AbiService,
    private readonly abiEventService: AbiEventService
  ) {}

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
}
