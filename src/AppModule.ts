import { Module, Global, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { AppController } from './AppController';
import { AppService } from './AppService';

import { AuthModule } from './auth/AuthModule';
import { DappModule } from './dapps/DappModule';
import { DappUserModule } from './dapp_users/DappUserModule';
import { UserModule } from './users/UserModule';
import { NotificationModule } from './notifications/NotificationModule';
import { mailModule } from './mailModule'

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(),
    mailModule,
    AuthModule,
    DappModule,
    DappUserModule,
    UserModule,
    NotificationModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ],
  exports: [
    mailModule
  ]
})

export class AppModule {
  constructor(private readonly connection: Connection) { }
}
