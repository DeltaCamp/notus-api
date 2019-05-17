import { UseGuards, UnauthorizedException, UseFilters } from '@nestjs/common'
import { Resolver, Mutation, Args } from '@nestjs/graphql'

import { GqlAuthGuard } from '../auth/GqlAuthGuard'
import { GqlAuthUser } from '../decorators/GqlAuthUser'
import {
  UserEntity,
  WebhookHeaderEntity,
  EventEntity
} from '../entities'
import { WebhookHeaderDto } from './WebhookHeaderDto'
import { WebhookHeaderService } from './WebhookHeaderService'
import { EventService } from '../events/EventService'

const debug = require('debug')('notus:WebhookHeaderResolver')
import { GqlRollbarExceptionFilter } from '../filters/GqlRollbarExceptionFilter';

@UseFilters(new GqlRollbarExceptionFilter())
@Resolver(of => WebhookHeaderEntity)
export class WebhookHeaderResolver {

  constructor(
    private readonly eventService: EventService,
    private readonly webhookHeaderService: WebhookHeaderService
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => WebhookHeaderEntity)
  async createWebhookHeader(
    @GqlAuthUser() user: UserEntity,
    @Args('webhookHeader') webhookHeaderDto: WebhookHeaderDto
  ): Promise<WebhookHeaderEntity> {
    const event = await this.getEvent(user, webhookHeaderDto.eventId)
    return await this.webhookHeaderService.createOrUpdate(event, webhookHeaderDto)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => WebhookHeaderEntity)
  async updateWebhookHeader(
    @GqlAuthUser() user: UserEntity,
    @Args('webhookHeader') webhookHeaderDto: WebhookHeaderDto
  ): Promise<WebhookHeaderEntity> {
    debug('updateWebhookHeader: ', webhookHeaderDto)
    const event = await this.getEvent(user, webhookHeaderDto.eventId)
    return await this.webhookHeaderService.update(webhookHeaderDto)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Boolean)
  async destroyWebhookHeader(
    @GqlAuthUser() user: UserEntity,
    @Args('webhookHeaderId') webhookHeaderId: number
  ): Promise<Boolean> {
    const webhookHeader = await this.webhookHeaderService.findOneOrFail(webhookHeaderId)
    const event = await this.getEvent(user, webhookHeader.eventId)
    await this.webhookHeaderService.destroy(webhookHeaderId)
    return true
  }

  async getEvent(user: UserEntity, eventId: number): Promise<EventEntity> {
    const event = await this.eventService.findOneOrFail(eventId)
    const isEventOwner = event.userId === user.id
    if (!isEventOwner) {
      throw new UnauthorizedException()
    }
    return event
  }
}
