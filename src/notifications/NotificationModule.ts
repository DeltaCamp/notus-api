import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationEntity } from './NotificationEntity';
import { NotificationService } from './NotificationService';
import { NotificationController } from './NotificationController';
import { NotificationGateway } from './NotificationGateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotificationEntity
    ])
  ],
  providers: [ NotificationService, NotificationGateway ],
  controllers: [ NotificationController ],
})

export class NotificationModule {}
