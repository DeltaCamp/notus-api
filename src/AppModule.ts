import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { PugAdapter, MailerModule } from '@nest-modules/mailer'
import { PassportModule } from '@nestjs/passport';

import { AppController } from './AppController';
import { AppService } from './AppService';
import { AuthService } from './AuthService';
import { HttpStrategy } from './HttpStrategy';

import { DappModule } from './dapps/DappModule';
import { DappUserModule } from './dapp_users/DappUserModule';
import { NotificationModule } from './notifications/NotificationModule';

const mailModule = MailerModule.forRootAsync({
  useFactory: () => ({
    transport: `smtps://${process.env.SEND_IN_BLUE_EMAIL}:${process.env.SEND_IN_BLUE_APIV2}@smtp-relay.sendinblue.com`,
    defaults: {
      from: '"Notus Network" <noreply@notus.network>'
    },
    template: {
      dir: __dirname + '/templates',
      adapter: new PugAdapter(),
      options: {
        strict: true
      }
    }
  })
})

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'bearer' }),
    TypeOrmModule.forRoot(),
    mailModule,
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
    mailModule, PassportModule, AuthService
  ]
})

export class AppModule {
  constructor(private readonly connection: Connection) { }
}
