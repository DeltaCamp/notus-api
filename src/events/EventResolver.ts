import { UseGuards, UnauthorizedException } from '@nestjs/common'
import { Mutation, Resolver, Query, Args } from '@nestjs/graphql'
import { GqlAuthGuard } from '../auth/GqlAuthGuard'

import { AuthUser } from '../decorators/AuthUser'
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
  async findEvent(@AuthUser() user, @Args('id') id: string): Promise<EventEntity> {
    const event = await this.eventService.findOne(id);
    if (event && event.user.id !== user.id) {
      throw new UnauthorizedException();
    }
    return event
  }

  @Mutation(returns => EventEntity)
  async createEvent(@Args('event') eventDto: EventDto): Promise<EventEntity> {
    const event = await this.eventService.createEvent(eventDto)
    this.eventGateway.add(event.id)
    return event
  }
}
