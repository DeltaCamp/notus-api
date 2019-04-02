import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventMatcherEntity } from './EventMatcherEntity'
import { EventMatcherService } from './EventMatcherService'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventMatcherEntity
    ])
  ],

  providers: [
    EventMatcherService
  ],

  exports: [
    EventMatcherService
  ]
})
export class EventMatcherModule {}
