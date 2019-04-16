import "reflect-metadata"
import { Module, Global, DynamicModule, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { GraphQLModule } from '@nestjs/graphql';

import { AppController } from './AppController';
import { AppService } from './AppService';
import { AuthModule } from './auth/AuthModule';
import { CommonModule } from './common/CommonModule';
import { AppModule } from './apps';
import { EventModule } from './events/EventModule';
import { mailModule } from './mailModule'
import { MatcherModule } from './matchers';
import { ContractModule } from './contracts/ContractModule';

import { TransactionMiddleware, TransactionModule } from './transactions';
import { UserModule } from './users';

const isProduction = process.env.NODE_ENV === 'production'

@Global()
@Module({
  imports: [
    AuthModule,
    CommonModule,
    ContractModule,
    AppModule,
    UserModule,
    MatcherModule,
    EventModule,
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

export class ApplicationModule implements NestModule {
  constructor(private readonly connection: Connection) { }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TransactionMiddleware)
      .forRoutes('*')
  }
}
