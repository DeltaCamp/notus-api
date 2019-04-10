import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  UserEntity,
  DappUserEntity,
  DappEntity
} from '../entities'
import { DappUserService } from './DappUserService'
import { DappUserResolver } from './DappUserResolver'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DappUserEntity
    ])
  ],

  providers: [
    DappUserService, DappUserResolver
  ],

  exports: [
    DappUserService
  ]
})

export class DappUserModule {}
