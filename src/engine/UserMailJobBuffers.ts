import { Injectable } from '@nestjs/common'

import { MailJobPublisher } from '../jobs/MailJobPublisher'
import { MailJobBuffer } from '../jobs/MailJobBuffer'
import { MailJob } from '../jobs/MailJob'
import { UserEntity } from '../entities';

const debug = require('debug')('notus:engine:UserMailJobBuffers')

@Injectable()
export class UserMailJobBuffers {
  private mailJobBuffers: Map<number, MailJobBuffer>;
  private users: Map<number, UserEntity>;

  constructor (
    private readonly mailJobPublisher: MailJobPublisher
  ) {
    this.users = new Map<number, UserEntity>()
    this.mailJobBuffers = new Map<number, MailJobBuffer>()
  }

  add(user: UserEntity, mailJob: MailJob) {
    let mailJobBuffer: MailJobBuffer = this.mailJobBuffers[user.id]
    if (!mailJobBuffer) {
      mailJobBuffer = new MailJobBuffer()
      this.mailJobBuffers[user.id] = mailJobBuffer
      this.users[user.id] = user
    }
    mailJobBuffer.add(mailJob)
  }

  async flush() {
    await Promise.all(Object.keys(this.mailJobBuffers).map(async userId => {
      const user = this.users[userId]
      const mailJobBuffer = this.mailJobBuffers[userId]
      const mailJob = mailJobBuffer.flush()
      if (mailJob) {
        mailJob.to = user.email
        debug(`Sending mail:`)
        debug(mailJob.text)
        await this.mailJobPublisher.sendMail(mailJob)
      }
    }))
    this.users = new Map<number, UserEntity>()
    this.mailJobBuffers = new Map<number, MailJobBuffer>()
  }
}
