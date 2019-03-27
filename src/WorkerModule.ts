import {
  Module, Global
} from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { WorkerNotificationManager } from './worker/WorkerNotificationManager'
import { LogManager } from './worker/LogManager'
import { MailModule } from './MailModule'

import { NotificationEntity } from './notifications/NotificationEntity'
import { NotificationService } from './notifications/NotificationService'
import { DappEntity } from './dapps/DappEntity'
import { DappService } from './dapps/DappService'
import { DappUserEntity } from './dapp_users/DappUserEntity'
import { DappUserService } from './dapp_users/DappUserService'
import { UserEntity } from './users/UserEntity'
import { UserService } from './users/UserService'

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(),
    MailModule,
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
    MailModule
  ]
})
export class WorkerModule {
  constructor(private readonly connection: Connection) { }
}
