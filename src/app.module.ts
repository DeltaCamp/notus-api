import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection, getConnectionOptions } from 'typeorm';
import { PugAdapter, MailerModule } from '@nest-modules/mailer'

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DappModule } from './dapps/dapp.module';
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
})

export class AppModule {
  constructor(private readonly connection: Connection) { }
}
