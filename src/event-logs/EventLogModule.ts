import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventLogEntity } from '../entities'
import { EventLogService } from './EventLogService'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventLogEntity
    ])
  ],

  providers: [
    EventLogService
  ],

  exports: [
    EventLogService
  ]
})
export class EventLogModule {}
