import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContractEntity } from '../entities';
import { ContractService } from './ContractService';
import { ContractResolver } from './ContractResolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ContractEntity
    ])
  ],
  providers: [
    ContractService, ContractResolver
  ],
  exports: [
    ContractService
  ]
})
export class ContractModule {}
