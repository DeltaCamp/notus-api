import { Resolver, ResolveProperty, Parent, Args, Query, Mutation } from '@nestjs/graphql'

import {
  UserEntity,
  AbiEventEntity,
  AbiEventInputEntity
} from '../entities'
import { AbiEventInputService } from './AbiEventInputService'
import { AbiEventService } from './AbiEventService'
import { AbiEventInputDto } from './AbiEventInputDto'
import { GqlRollbarExceptionFilter } from '../filters/GqlRollbarExceptionFilter';
import { UseFilters, UseGuards, UnauthorizedException } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/GqlAuthGuard';
import { GqlAuthUser } from '../decorators/GqlAuthUser';

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

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => AbiEventInputEntity)
  @UseFilters(new GqlRollbarExceptionFilter())
  async updateAbiEventInput(
    @GqlAuthUser() user: UserEntity,
    @Args('abiEventInput') abiEventInputDto: AbiEventInputDto
  ): Promise<AbiEventInputEntity> {
    const abiEventInput = await this.abiEventInputService.findOneOrFail(abiEventInputDto.id)
    if (abiEventInput.abiEvent.abi.ownerId !== user.id) {
      throw new UnauthorizedException()
    }
    const event = await this.abiEventInputService.update(abiEventInput, abiEventInputDto)
    return event
  }
}
