import { Injectable, Inject, forwardRef } from '@nestjs/common';

import {
  EventEntity,
  WebhookHeaderEntity
} from '../entities'
import { EntityManagerProvider, Transaction } from '../transactions'
import { WebhookHeaderDto } from './WebhookHeaderDto'
import { notDefined } from '../utils/notDefined';

const debug = require('debug')('notus:events:WebhookHeaderService')

@Injectable()
export class WebhookHeaderService {

  constructor (
    private readonly provider: EntityManagerProvider
  ) {}

  @Transaction()
  async findOne(webhookHeaderId: number): Promise<WebhookHeaderEntity> {
    return await this.provider.get().findOne(WebhookHeaderEntity, webhookHeaderId)
  }

  @Transaction()
  async findOneOrFail(webhookHeaderId: number): Promise<WebhookHeaderEntity> {
    if (notDefined(webhookHeaderId)) { throw new Error(`id must be defined`) }
    return await this.provider.get().findOneOrFail(WebhookHeaderEntity, webhookHeaderId)
  }
  
  @Transaction()
  async createOrUpdate(event: EventEntity, webhookHeaderDto: WebhookHeaderDto): Promise<WebhookHeaderEntity> {
    if (webhookHeaderDto.id) {
      return await this.update(webhookHeaderDto)
    } else {
      return await this.createMatcher(event, webhookHeaderDto)
    }
  }

  @Transaction()
  async createMatcher(event: EventEntity, webhookHeaderDto: WebhookHeaderDto): Promise<WebhookHeaderEntity> {
    const webhookHeader = new WebhookHeaderEntity()

    webhookHeader.event = event
    webhookHeader.key = webhookHeaderDto.key
    webhookHeader.value = webhookHeaderDto.value

    await this.provider.get().save(webhookHeader)

    return webhookHeader
  }

  @Transaction()
  async update(webhookHeaderDto: WebhookHeaderDto): Promise<WebhookHeaderEntity> {
    const webhookHeader = await this.findOneOrFail(webhookHeaderDto.id)

    if (webhookHeaderDto.key !== undefined) {
      webhookHeader.key = webhookHeaderDto.key
    }

    if (webhookHeaderDto.value !== undefined) {
      webhookHeader.value = webhookHeaderDto.value
    }

    await this.provider.get().save(webhookHeader)

    return webhookHeader
  }

  @Transaction()
  async destroy(webhookHeaderId: number) {
    await this.provider.get().delete(WebhookHeaderEntity, webhookHeaderId);
  }
}
