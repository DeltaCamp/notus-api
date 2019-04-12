import "reflect-metadata"
import { Module, Global, DynamicModule, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

import { AppController } from './AppController';
import { AppService } from './AppService';
import { AuthModule } from './auth/AuthModule';
import { CommonModule } from './common/CommonModule';
import { DappModule } from './dapps';
import { DappUserModule } from './dapp-users';
import { EventModule } from './events/EventModule';
import { EventMatcherModule } from './event-matchers';
import { EventTypeMatcherModule } from './event-type-matchers';
import { EventTypeModule } from './event-types';
import { mailModule } from './mailModule'
import { MatcherModule } from './matchers';
import { TransactionMiddleware, TransactionModule } from './typeorm';
import { UserModule } from './users';

const isProduction = process.env.NODE_ENV === 'production'
let baseDir = 'src'
if (isProduction) {
  baseDir = 'dist'
}

@Global()
@Module({
  imports: [
    AuthModule,
    CommonModule,
    DappModule,
    UserModule,
    DappUserModule,
    MatcherModule,
    EventModule,
    EventMatcherModule,
    EventTypeMatcherModule,
    EventTypeModule,
    GraphQLModule.forRoot({
      playground: !isProduction,
      debug: !isProduction,
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
      context: ({ req }) => ({ req })
    }),
    mailModule,
    TransactionModule,
    TypeOrmModule.forRoot()
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

export class AppModule implements NestModule {
  constructor(private readonly connection: Connection) { }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TransactionMiddleware)
      .forRoutes('*')
  }
}
