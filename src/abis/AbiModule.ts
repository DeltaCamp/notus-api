import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  AbiEntity,
  AbiEventEntity,
  AbiEventInputEntity
} from '../entities';
import { AbiService } from './AbiService'
import { AbiResolver } from './AbiResolver'
import { AbiEventInputResolver } from './AbiEventInputResolver'
import { AbiEventInputService } from './AbiEventInputService'
import { AbiEventService } from './AbiEventService'
import { AbiEventResolver } from './AbiEventResolver'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AbiEntity,
      AbiEventEntity,
      AbiEventInputEntity
    ])
  ],

  providers: [
    AbiService,
    AbiResolver,
    AbiEventResolver,
    AbiEventInputResolver,
    AbiEventInputService,
    AbiEventService
  ],

  exports: [
    AbiService,
    AbiEventService
  ]
})
export class AbiModule {}
