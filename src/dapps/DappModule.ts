import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DappEntity } from './DappEntity';
import { DappUserEntity } from '../dapp_users/DappUserEntity'
import { DappService } from './DappService';
import { DappController } from './DappController';

import { UserService } from '../users/UserService';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DappUserEntity,
      DappEntity,
      UserEntity
    ])
  ],
  providers: [ DappService, UserService ],
  controllers: [ DappController ],
})

export class DappModule {}
