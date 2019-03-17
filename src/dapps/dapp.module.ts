import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DappController } from './dapp.controller';
import { Dapp } from '../entity/dapp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ Dapp ])],
  providers: [],
  controllers: [ DappController ],
})

export class DappModule {}