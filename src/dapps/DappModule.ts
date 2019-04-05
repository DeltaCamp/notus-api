import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DappEntity } from './DappEntity';
import { DappResolver } from './DappResolver';
import { DappService } from './DappService';
import { DappUserEntity } from '../dapp-users/DappUserEntity';
import { UserEntity } from '../users/UserEntity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DappEntity
    ])
  ],
  providers: [
    DappService, DappResolver
  ]
})
export class DappModule {}
