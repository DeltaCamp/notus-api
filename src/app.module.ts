import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DappController } from './dapps/dapp.controller';
import { DappModule } from './dapps/dapp.module';
import { DappService } from './dapps/dapp.service';
import { Dapp } from './entity/dapp.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dapp]),
    TypeOrmModule.forRoot(),
    DappModule
  ],
  controllers: [ AppController, DappController ],
  providers: [ AppService, DappService ],
})

export class AppModule {
  constructor(private readonly connection: Connection) { }
}
