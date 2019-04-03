import { UseGuards, UnauthorizedException } from '@nestjs/common'
import { Mutation, Resolver, Query, Args } from '@nestjs/graphql'
import { GqlAuthGuard } from '../auth/GqlAuthGuard'

import { GqlAuthUser } from '../decorators/GqlAuthUser'
import { UserEntity } from '../users/UserEntity'
import { EventEntity } from './EventEntity'
import { EventService } from './EventService'
import { EventGateway } from './EventGateway'
import { EventDto } from './EventDto'

@Resolver(of => EventEntity)
export class EventResolver {

  constructor(
    private readonly eventService: EventService,
    private readonly eventGateway: EventGateway
  ) {}

  @Query(returns => EventEntity, { nullable: true })
  async findEvent(@Args('id') id: string): Promise<EventEntity> {
    return await this.eventService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => EventEntity)
  async createEvent(
    @GqlAuthUser() user: UserEntity,
    @Args('event') eventDto: EventDto
  ): Promise<EventEntity> {
    const event = await this.eventService.createEvent(user, eventDto)
    this.eventGateway.add(event.id)
    return event
  }
}
