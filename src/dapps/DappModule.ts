import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DappEntity } from './DappEntity';
import { DappService } from './DappService';
import { DappController } from './DappController';

import { UserService } from '../users/UserService';

@Module({
  imports: [
    TypeOrmModule.forFeature([ DappEntity ])
  ],
  providers: [ DappService, UserService ],
  controllers: [ DappController ],
})

export class DappModule {}
