import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DappUserController } from './DappUserController';
import { DappUserEntity } from '../dapp_users/DappUserEntity';
import { DappUserService } from './DappUserService';

@Module({
  imports: [
    TypeOrmModule.forFeature([DappUserEntity])
  ],
  controllers: [
    DappUserController
  ],
  providers: [
    DappUserService
  ]
})
export class DappUserModule {}
