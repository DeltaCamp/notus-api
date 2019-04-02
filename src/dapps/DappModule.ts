import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DappController } from './DappController';
import { DappEntity } from './DappEntity';
import { DappResolver } from './DappResolver';
import { DappService } from './DappService';
import { DappUserEntity } from '../dapp-users/DappUserEntity';
import { UserEntity } from '../users/UserEntity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DappUserEntity,
      DappEntity,
      UserEntity
    ])
  ],
  providers: [
    DappService, DappResolver
  ],
  controllers: [
    DappController
  ]
})
export class DappModule {}
