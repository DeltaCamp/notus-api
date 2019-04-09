import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  UserEntity,
  DappUserEntity,
  DappEntity
} from '../entities'
import { DappUserService } from './DappUserService'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DappUserEntity
    ])
  ],

  providers: [
    DappUserService
  ],

  exports: [
    DappUserService
  ]
})

export class DappUserModule {}
