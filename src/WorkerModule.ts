import {
  Module, Global, DynamicModule
} from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { WorkerNotificationManager } from './worker/WorkerNotificationManager'
import { LogManager } from './worker/LogManager'

import { NotificationEntity } from './notifications/NotificationEntity'
import { NotificationService } from './notifications/NotificationService'
import { DappEntity } from './dapps/DappEntity'
import { DappService } from './dapps/DappService'
import { DappUserEntity } from './dapp_users/DappUserEntity'
import { DappUserService } from './dapp_users/DappUserService'
import { UserEntity } from './users/UserEntity'
import { UserService } from './users/UserService'

const mailModule: DynamicModule = require('./mailModule')

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(),
    mailModule,
    TypeOrmModule.forFeature([
      NotificationEntity,
      DappUserEntity,
      DappEntity,
      UserEntity
    ])
  ],
  providers: [
    WorkerNotificationManager,
    LogManager,
    NotificationService,
    DappUserService,
    DappService,
    UserService
  ],
  exports: [
    mailModule
  ]
})
export class WorkerModule {
  constructor(private readonly connection: Connection) { }
}
