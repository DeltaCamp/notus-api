import { Injectable } from '@nestjs/common';

import {
  EventEntity,
  WebhookHeaderEntity
} from '../entities'
import { EntityManagerProvider, Transaction } from '../transactions'
import { WebhookHeaderDto } from './WebhookHeaderDto'
import { notDefined } from '../utils/notDefined';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { Service } from '../Service';

const debug = require('debug')('notus:events:WebhookHeaderService')

@Injectable()
export class WebhookHeaderService extends Service {

  constructor (
    @InjectConnection()
    connection: Connection
  ) {
    super(connection)
  }

  async findOne(webhookHeaderId: number): Promise<WebhookHeaderEntity> {
    return await this.manager().findOne(WebhookHeaderEntity, webhookHeaderId)
  }

  async findOneOrFail(webhookHeaderId: number): Promise<WebhookHeaderEntity> {
    if (notDefined(webhookHeaderId)) { throw new Error(`id must be defined`) }
    return await this.manager().findOneOrFail(WebhookHeaderEntity, webhookHeaderId)
  }
  
  async createOrUpdate(event: EventEntity, webhookHeaderDto: WebhookHeaderDto): Promise<WebhookHeaderEntity> {
    if (webhookHeaderDto.id) {
      return await this.update(webhookHeaderDto)
    } else {
      return await this.create(event, webhookHeaderDto)
    }
  }

  async create(event: EventEntity, webhookHeaderDto: WebhookHeaderDto): Promise<WebhookHeaderEntity> {
    const webhookHeader = new WebhookHeaderEntity()

    webhookHeader.event = event
    webhookHeader.key = webhookHeaderDto.key
    webhookHeader.value = webhookHeaderDto.value

    await this.manager().save(webhookHeader)

    return webhookHeader
  }

  async update(webhookHeaderDto: WebhookHeaderDto): Promise<WebhookHeaderEntity> {
    const webhookHeader = await this.findOneOrFail(webhookHeaderDto.id)

    if (webhookHeaderDto.key !== undefined) {
      webhookHeader.key = webhookHeaderDto.key
    }

    if (webhookHeaderDto.value !== undefined) {
      webhookHeader.value = webhookHeaderDto.value
    }

    await this.manager().save(webhookHeader)

    return webhookHeader
  }

  async destroy(webhookHeaderId: number) {
    await this.manager().delete(WebhookHeaderEntity, webhookHeaderId);
  }
}
