import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatcherModule } from '../matchers/MatcherModule'
import { EventTypeMatcherEntity } from './EventTypeMatcherEntity'
import { EventTypeMatcherService } from './EventTypeMatcherService'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventTypeMatcherEntity
    ])
  ],

  providers: [
    EventTypeMatcherService
  ],

  exports: [
    EventTypeMatcherService
  ]
})
export class EventTypeMatcherModule {}
