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
import { DappModule } from './dapps/DappModule';
import { DappUserModule } from './dapp-users/DappUserModule';
import { EntityManagerProvider } from './typeorm/EntityManagerProvider';
import { EventModule } from './events/EventModule';
import { EventMatcherModule } from './event-matchers/EventMatcherModule';
import { EventTypeMatcherModule } from './event-type-matchers/EventTypeMatcherModule';
import { EventTypeModule } from './event-types/EventTypeModule';
import { mailModule } from './mailModule'
import { MatcherModule } from './matchers/MatcherModule';
import { TransactionMiddleware } from './typeorm/TransactionMiddleware';
import { UserModule } from './users/UserModule';
import { VariableModule } from './variables/VariableModule';

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
    DappUserModule,
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
    MatcherModule,
    TypeOrmModule.forRoot(),
    UserModule,
    VariableModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService, EntityManagerProvider
  ],
  exports: [
    mailModule, EntityManagerProvider
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
