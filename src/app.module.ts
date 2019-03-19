import { Module } from '@nestjs/common';
import { PugAdapter, MailerModule } from '@nest-modules/mailer'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DappController } from './dapps/dapp.controller';
import { DappModule } from './dapps/dapp.module';
import { DappService } from './dapps/dapp.service';
import { Dapp } from './entity/dapp.entity';

const mailerModuleConfig = MailerModule.forRootAsync({
  useFactory: () => ({
    transport: 'smtps://chuck@delta.camp:a6S0f2QHxzvwAPhX@smtp-relay.sendinblue.com',
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

@Module({
  imports: [
    TypeOrmModule.forFeature([Dapp]),
    TypeOrmModule.forRoot(),
    DappModule,
    mailerModuleConfig
  ],
  controllers: [ AppController, DappController ],
  providers: [ AppService, DappService ],
})

export class AppModule {
  constructor(private readonly connection: Connection) { }
}
