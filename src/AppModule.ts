import { Module, Global, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { PassportModule } from '@nestjs/passport';

import { AppController } from './AppController';
import { AppService } from './AppService';
import { AuthUserStrategy } from './AuthUserStrategy';
import { AuthUserOrDappUserStrategy } from './AuthUserOrDappUserStrategy';

import { DappModule } from './dapps/DappModule';
import { DappUserModule } from './dapp_users/DappUserModule';
import { UserModule } from './users/UserModule';
import { NotificationModule } from './notifications/NotificationModule';

import { mailModule } from './mailModule'

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'bearer' }),
    TypeOrmModule.forRoot(),
    mailModule,
    DappModule,
    DappUserModule,
    UserModule,
    NotificationModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService, AuthUserStrategy, AuthUserOrDappUserStrategy
  ],
  exports: [
    mailModule, PassportModule
  ]
})

export class AppModule {
  constructor(private readonly connection: Connection) { }
}
