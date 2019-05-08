import "reflect-metadata"
import {
  Module, Global
} from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { AbiModule } from './abis/AbiModule'
import { ContractModule } from './contracts/ContractModule';
import { EventModule } from './events'
import { AppModule } from './apps'
import { EngineModule } from './engine/EngineModule'
import { MatcherModule } from './matchers';
import { mailerModule } from './mailerModule'
import { TemplateModule } from './templates/TemplateModule'
import { WorkLogModule } from './work-logs/WorkLogModule'
import { JobModule } from './jobs/JobModule'
import { EventLogModule } from './event-logs/EventLogModule'
import { EntityManagerProvider } from './transactions/EntityManagerProvider';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ContractModule,
    EngineModule,
    EventLogModule,
    AppModule,
    mailerModule,
    EventModule,
    MatcherModule,
    JobModule,
    TemplateModule,
    WorkLogModule,
    AbiModule
  ],
  providers: [
    EntityManagerProvider
  ],
  exports: [
    mailerModule, EntityManagerProvider
  ]
})
export class WorkerModule {
  constructor(private readonly connection: Connection) { }
}
