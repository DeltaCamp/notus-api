import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { PassportModule } from '@nestjs/passport';

import { AppController } from './AppController';
import { AppService } from './AppService';
import { AuthService } from './AuthService';
import { HttpStrategy } from './HttpStrategy';

import { DappModule } from './dapps/DappModule';
import { DappUserModule } from './dapp_users/DappUserModule';
import { NotificationModule } from './notifications/NotificationModule';

import { MailModule } from './MailModule'

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'bearer' }),
    TypeOrmModule.forRoot(),
    MailModule,
    DappModule,
    DappUserModule,
    NotificationModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService, AuthService, HttpStrategy
  ],
  exports: [
    MailModule, PassportModule, AuthService
  ]
})

export class AppModule {
  constructor(private readonly connection: Connection) { }
}
