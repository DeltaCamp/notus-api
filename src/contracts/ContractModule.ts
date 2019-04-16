import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  ContractEntity,
  ContractEventEntity,
  ContractEventInputEntity
} from '../entities';
import { ContractService } from './ContractService'
import { ContractResolver } from './ContractResolver'
import { ContractEventInputResolver } from './ContractEventInputResolver'
import { ContractEventInputService } from './ContractEventInputService'
import { ContractEventService } from './ContractEventService'
import { ContractEventResolver } from './ContractEventResolver'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ContractEntity,
      ContractEventEntity,
      ContractEventInputEntity
    ])
  ],

  providers: [
    ContractService,
    ContractResolver,
    ContractEventResolver,
    ContractEventInputResolver,
    ContractEventInputService,
    ContractEventService
  ],

  exports: [
    ContractService,
    ContractEventService
  ]
})
export class ContractModule {}
