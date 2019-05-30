import { Injectable } from '@nestjs/common'

import { PgBossProvider } from './PgBossProvider';
import { JOB_NAME, MailJob } from './MailJob'

const debug = require('debug')('notus:jobs:MailJobPublisher')

@Injectable()
export class MailJobPublisher {

  constructor (
    private readonly provider: PgBossProvider
  ) {}

  async sendMail(mailJob: MailJob) {
    debug(`sendMail(${mailJob.subject}`)
    await this.provider.get().publish(
      JOB_NAME,
      mailJob,
      {
        retryLimit: 2,
        expireIn: '10 minutes'
      }
    )
  }
}