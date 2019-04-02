import {
  Module, Global
} from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { WorkerNotificationManager } from './worker/WorkerNotificationManager'
import { LogManager } from './worker/LogManager'

import { DappEntity } from './dapps/DappEntity'
import { DappUserEntity } from './dapp-users/DappUserEntity'
import { DappUserService } from './dapp-users/DappUserService'
import { UserEntity } from './users/UserEntity'
import { UserService } from './users/UserService'

import { mailModule } from './mailModule'

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(),
    mailModule,
    TypeOrmModule.forFeature([
      DappUserEntity,
      DappEntity,
      UserEntity
    ])
  ],
  providers: [
    WorkerNotificationManager,
    LogManager,
    DappUserService,
    UserService
  ],
  exports: [
    mailModule
  ]
})
export class WorkerModule {
  constructor(private readonly connection: Connection) { }
}
