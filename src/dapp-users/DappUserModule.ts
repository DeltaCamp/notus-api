import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DappUserEntity } from './DappUserEntity';
import { DappEntity } from '../dapps/DappEntity'
import { UserEntity } from '../users/UserEntity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DappUserEntity,
      DappEntity,
      UserEntity
    ])
  ]
})

export class DappUserModule {}
