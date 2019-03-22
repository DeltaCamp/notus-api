import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DappUserController } from './DappUserController';
import { DappUser } from '../entity/DappUser';
import { DappUserService } from './DappUserService';

@Module({
  imports: [
    TypeOrmModule.forFeature([DappUser])
  ],
  controllers: [
    DappUserController
  ],
  providers: [
    DappUserService
  ]
})
export class DappUserModule {}
