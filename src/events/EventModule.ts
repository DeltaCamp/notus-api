import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventEntity } from '../entities';
import { EventService } from './EventService';
import { EventResolver } from './EventResolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventEntity
    ])
  ],
  providers: [
    EventService, EventResolver
  ],

  exports: [
    EventService
  ]
})
export class EventModule {}
