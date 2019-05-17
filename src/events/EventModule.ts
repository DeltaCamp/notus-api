import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  EventEntity,
  WebhookHeaderEntity
} from '../entities';
import { EventService } from './EventService';
import { EventResolver } from './EventResolver';
import { WebhookHeaderService } from './WebhookHeaderService';
import { WebhookHeaderResolver } from './WebhookHeaderResolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventEntity
    ])
  ],
  providers: [
    EventService, EventResolver, WebhookHeaderResolver, WebhookHeaderService
  ],

  exports: [
    EventService, WebhookHeaderService
  ]
})
export class EventModule {}
