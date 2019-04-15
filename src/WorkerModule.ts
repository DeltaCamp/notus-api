import "reflect-metadata"
import {
  Module, Global
} from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { EventModule } from './events'
import { AppModule } from './apps'
import { EngineModule } from './engine/EngineModule'
import { MatcherModule } from './matchers';
import { mailModule } from './mailModule'
import { EntityManagerProvider } from './transactions/EntityManagerProvider';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(),
    EngineModule,
    AppModule,
    mailModule,
    EventModule,
    MatcherModule
  ],
  providers: [
    EntityManagerProvider
  ],
  exports: [
    mailModule, EntityManagerProvider
  ]
})
export class WorkerModule {
  constructor(private readonly connection: Connection) { }
}
