import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DappUserEntity } from './DappUserEntity';
import { DappUserController } from './DappUserController';
import { DappUserService } from './DappUserService';

import { DappEntity } from '../dapps/DappEntity'
import { UserEntity } from '../users/UserEntity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DappUserEntity,
      DappEntity,
      UserEntity
    ])
  ],
  controllers: [
    DappUserController
  ],
  providers: [
    DappUserService
  ],
  exports: [
    DappUserService
  ]
})

export class DappUserModule {}