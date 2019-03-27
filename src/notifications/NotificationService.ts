import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { MailerService } from '@nest-modules/mailer';

import { NotificationEntity } from './NotificationEntity'
import { DappUserEntity } from '../dapp_users/DappUserEntity'
import { rollbar } from '../rollbar'

@Injectable()
export class NotificationService {

  constructor (
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    private readonly mailerService: MailerService
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
      topics: topics || [],
      subject,
      body
    })

    await this.notificationRepository.save(notification)

    return notification;
  }

  public async destroy(notification) {
    await this.notificationRepository.delete(notification.id)
  }

  public async findAll() {
    return await this.notificationRepository.find({ relations: ['dapp_user', 'dapp_user.user'] })
  }

  public find(id) {
    return this.notificationRepository.findOneOrFail(id, { relations: ['dapp_user', 'dapp_user.user'] })
  }

  public notify(notification, log) {
    console.log('Notifying ', notification)

    this.mailerService.sendMail({
      to: notification.dapp_user.user.email,
      subject: notification.subject,
      html: notification.body,
      text: notification.body
    }).catch(error => {
      rollbar.error(error)
    })
  }
}
