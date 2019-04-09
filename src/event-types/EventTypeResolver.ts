import { UseGuards, UnauthorizedException, Inject, forwardRef } from '@nestjs/common'
import { Mutation, Resolver, Query, Args, Parent, ResolveProperty } from '@nestjs/graphql'

import { GqlAuthGuard } from '../auth/GqlAuthGuard'
import { AuthUser } from '../decorators/AuthUser'
import {
  DappEntity,
  VariableEntity,
  EventTypeEntity,
  EventTypeMatcherEntity
} from '../entities'
import { EventTypeService } from './EventTypeService'
import { EventTypeDto } from './EventTypeDto'
import { DappUserService } from '../dapp-users/DappUserService'

@Resolver(of => EventTypeEntity)
export class EventTypeResolver {

  constructor(
    private readonly eventTypeService: EventTypeService,
    private readonly dappUserService: DappUserService
  ) {}

  @Query(returns => EventTypeEntity)
  async eventType(@Args('id') id: string): Promise<EventTypeEntity> {
    return await this.eventTypeService.findOne(id);
  }

  @Query(returns => [EventTypeEntity])
  async eventTypes(): Promise<EventTypeEntity[]> {
    return await this.eventTypeService.find();
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => EventTypeEntity)
  async createEventType(@AuthUser() user, @Args('eventType') eventTypeDto: EventTypeDto): Promise<EventTypeEntity> {
    await this.checkIsDappOwner(eventTypeDto.dappId, user.id)
    return await this.eventTypeService.createEventType(eventTypeDto)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => EventTypeEntity)
  async updateEventType(@AuthUser() user, @Args('eventType') eventTypeDto: EventTypeDto): Promise<EventTypeEntity> {
    const eventType = await this.eventTypeService.findOneOrFail(eventTypeDto.id)
    await this.checkIsDappOwner(eventType.dappId, user.id)
    return await this.eventTypeService.update(eventType, eventTypeDto)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Boolean)
  async destroyEventType(@AuthUser() user, @Args('eventTypeId') eventTypeId: number): Promise<Boolean> {
    const eventType = await this.eventTypeService.findOneOrFail(eventTypeId)
    await this.checkIsDappOwner(eventType.dappId, user.id)
    await this.eventTypeService.destroy(eventType)
    return true
  }

  @ResolveProperty('eventTypeMatchers')
  async eventTypeMatchers(@Parent() eventType: EventTypeEntity): Promise<EventTypeMatcherEntity[]> {
    return await this.eventTypeService.getEventTypeMatchers(eventType)
  }

  @ResolveProperty('dapp')
  async dapp(@Parent() eventType: EventTypeEntity): Promise<DappEntity> {
    return await this.eventTypeService.getDapp(eventType)
  }

  @ResolveProperty('variables')
  async variables(@Parent() eventType: EventTypeEntity): Promise<VariableEntity[]> {
    return await this.eventTypeService.getVariables(eventType)
  }

  async checkIsDappOwner(dappId: number, userId: number) {
    const isDappOwner = await this.dappUserService.isOwner(dappId, userId)
    if (!isDappOwner) {
      throw new UnauthorizedException()
    }
  }
}
