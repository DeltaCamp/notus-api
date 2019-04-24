import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkLogEntity } from '../entities'
import { WorkLogService } from './WorkLogService'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkLogEntity
    ])
  ],

  providers: [
    WorkLogService
  ],

  exports: [
    WorkLogService
  ]
})
export class WorkLogModule {}
