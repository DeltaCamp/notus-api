import "reflect-metadata"
import { Module, Global, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { GraphQLModule } from '@nestjs/graphql';

import { AppController } from './AppController';
import { AppService } from './AppService';
import { AuthModule } from './auth/AuthModule';
import { CommonModule } from './common/CommonModule';
import { AppModule } from './apps';
import { EventModule } from './events/EventModule';
import { mailerModule } from './mailerModule'
import { JobModule } from './jobs/JobModule'
import { EngineModule } from './engine/EngineModule'
import { MatcherModule } from './matchers';
import { TemplateModule } from './templates/TemplateModule'
import { AbiModule } from './abis/AbiModule';
import { WorkLogModule } from './work-logs/WorkLogModule'

import { TransactionMiddleware, TransactionModule } from './transactions';
import { UserModule } from './users';

const isProduction = process.env.NODE_ENV === 'production'

@Global()
@Module({
  imports: [
    AuthModule,
    CommonModule,
    AbiModule,
    AppModule,
    UserModule,
    MatcherModule,
    EventModule,
    TemplateModule,
    JobModule,
    EngineModule,
    GraphQLModule.forRoot({
      playground: !isProduction,
      debug: !isProduction,
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
      context: ({ req }) => ({ req })
    }),
    mailerModule,
    TransactionModule,
    WorkLogModule,
    TypeOrmModule.forRoot()
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ],
  exports: [
    mailerModule
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
