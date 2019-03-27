import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'

import { NotificationEntity } from './NotificationEntity'
import { DappUserEntity } from '../dapp_users/DappUserEntity'

@Injectable()
export class NotificationService {

  constructor (
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>
  ) {}

  public async create(
    dapp_user: DappUserEntity,
    contractAddress: string,
    topics: string[],
    subject: string,
    body: string
  ): Promise<NotificationEntity> {
    let notification = new NotificationEntity()

    Object.assign(notification, {
      dapp_user,
      address: contractAddress,
      topics,
      subject,
      body
    })

    await this.notificationRepository.save(notification)

    return notification;
  }
}
