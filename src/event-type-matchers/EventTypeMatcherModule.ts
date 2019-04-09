import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatcherModule } from '../matchers'
import { EventTypeMatcherEntity } from '../entities'
import { EventTypeMatcherService } from './EventTypeMatcherService'
import { EventTypeMatcherResolver } from './EventTypeMatcherResolver'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventTypeMatcherEntity
    ])
  ],

  providers: [
    EventTypeMatcherService, EventTypeMatcherResolver
  ],

  exports: [
    EventTypeMatcherService
  ]
})
export class EventTypeMatcherModule {}
