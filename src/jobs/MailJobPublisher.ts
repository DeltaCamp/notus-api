import { Injectable } from '@nestjs/common'

import { PgBossProvider } from './PgBossProvider';
import { JOB_NAME, MailJob } from './MailJob'

@Injectable()
export class MailJobPublisher {

  constructor (
    private readonly provider: PgBossProvider
  ) {}

  async sendMail(mailJob: MailJob) {
    await this.provider.get().publish(JOB_NAME, mailJob)
  }
}