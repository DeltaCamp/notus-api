import "reflect-metadata"
import {
  Module, Global
} from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import {
  DappEntity,
  UserEntity
} from './entities'
import { EventMatcherModule } from './event-matchers'
import { EventTypeMatcherModule } from './event-type-matchers'
import { EventTypeModule } from './event-types'
import { EventModule } from './events'
import { DappModule } from './dapps'
import { DappUserModule } from './dapp-users'
import { EngineModule } from './engine/EngineModule'
import { MatcherModule } from './matchers';
import { mailModule } from './mailModule'
import { EntityManagerProvider } from './typeorm/EntityManagerProvider';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(),
    EngineModule,
    DappModule,
    DappUserModule,
    mailModule,
    EventMatcherModule,
    EventTypeMatcherModule,
    EventTypeModule,
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
