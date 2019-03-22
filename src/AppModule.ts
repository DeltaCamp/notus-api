import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { PugAdapter, MailerModule } from '@nest-modules/mailer'

import { AppController } from './AppController';
import { AppService } from './AppService';

import { DappModule } from './dapps/DappModule';
import { DappUserModule } from './dapp_users/DappUserModule';

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
    TypeOrmModule.forRoot(),
    mailModule,
    DappModule,
    DappUserModule
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
