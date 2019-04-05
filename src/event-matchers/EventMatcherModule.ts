import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventMatcherEntity } from './EventMatcherEntity'
import { EventMatcherService } from './EventMatcherService'
import { EventMatcherResolver } from './EventMatcherResolver'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventMatcherEntity
    ])
  ],

  providers: [
    EventMatcherService, EventMatcherResolver
  ],

  exports: [
    EventMatcherService
  ]
})
export class EventMatcherModule {}
