import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DappController } from './dapp.controller';
import { DappService } from './dapp.service';
import { DappEntity } from './DappEntity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ DappEntity ])
  ],
  providers: [ DappService ],
  controllers: [ DappController ],
})

export class DappModule {}
