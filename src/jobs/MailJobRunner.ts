import { Injectable } from '@nestjs/common'
import { MailerService } from '@nest-modules/mailer';

import { PgBossProvider } from './PgBossProvider';
import { JOB_NAME, MailJob } from './MailJob'

@Injectable()
export class MailJobRunner {

  constructor (
    private readonly provider: PgBossProvider,
    private readonly mailerService: MailerService
  ) {}

  async start() {
    await this.provider.get().subscribe(JOB_NAME, this.handle)
  }

  handle = async (job) => {
    const mailJob: MailJob = job.data
    await this.mailerService.sendMail(mailJob)
  }
}