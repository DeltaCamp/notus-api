import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventEntity } from './EventEntity';
import { EventService } from './EventService';
import { EventResolver } from './EventResolver';
import { EventGateway } from './EventGateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventEntity
    ])
  ],
  providers: [
    EventService, EventResolver, EventGateway
  ]
})
export class EventModule {}
