import { Resolver, ResolveProperty, Parent, Args, Query } from '@nestjs/graphql'

import {
  AbiEventEntity,
  AbiEventInputEntity
} from '../entities'
import { AbiEventInputService } from './AbiEventInputService'
import { AbiEventService } from './AbiEventService'
import { GqlRollbarExceptionFilter } from '../filters/GqlRollbarExceptionFilter';
import { UseFilters } from '@nestjs/common';

@UseFilters(new GqlRollbarExceptionFilter())
@Resolver(of => AbiEventInputEntity)
export class AbiEventInputResolver {

  constructor(
    private readonly abiEventInputService: AbiEventInputService,
    private readonly abiEventService: AbiEventService
  ) {}

  @Query(returns => [AbiEventInputEntity])
  async abiEventInputs (
    @Args({ name: 'name', type: () => String, nullable: true }) name: string,
    @Args({ name: 'abiEventId', type: () => Number, nullable: true }) abiEventId: number): Promise<AbiEventInputEntity[]> {
    return await this.abiEventInputService.findByNameAndAbiEventId(name, abiEventId)
  }

  @Query(returns => AbiEventInputEntity)
  async abiEventInput (
    @Args('id') id: number
  ) {
    return await this.abiEventInputService.findOneOrFail(id)
  }

  @ResolveProperty('abiEvent')
  async abiEvent(@Parent() abiEventInput: AbiEventInputEntity): Promise<AbiEventEntity> {
    return await this.abiEventService.findOneOrFail(abiEventInput.abiEventId)
  }
}
