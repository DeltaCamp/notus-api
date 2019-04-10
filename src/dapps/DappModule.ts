import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DappEntity, DappUserEntity, UserEntity } from '../entities';
import { DappResolver } from './DappResolver';
import { DappService } from './DappService';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DappEntity
    ])
  ],
  providers: [
    DappService, DappResolver
  ],

  exports: [
    DappService
  ]
})
export class DappModule {}
