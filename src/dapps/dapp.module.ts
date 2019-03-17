import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DappController } from './dapp.controller';
import { DappService } from './dapp.service';
import { Dapp } from '../entity/dapp.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ Dapp ]) ],
  providers: [ DappService ],
  controllers: [ DappController ],
})

export class DappModule {}