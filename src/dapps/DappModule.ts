import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DappEntity } from './DappEntity';
import { DappController } from './DappController';
import { DappService } from './DappService';
import { DappUserEntity } from '../dapp_users/DappUserEntity'
import { UserEntity } from '../users/UserEntity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DappUserEntity,
      DappEntity,
      UserEntity
    ])
  ],
  providers: [
    DappService
  ],
  controllers: [
    DappController
  ]
})
export class DappModule {}
