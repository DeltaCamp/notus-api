import { Injectable } from '@nestjs/common'
import { MailerService } from '@nest-modules/mailer';
import { pick } from 'lodash'

import { PgBossProvider } from './PgBossProvider';
import { JOB_NAME, MailJob } from './MailJob'

const debug = require('debug')('notus:jobs:MailJobRunner')

const TEAM_SIZE = 10 // the number of jobs to fetch per polling period
const TEAM_CONCURRENCY = 2 // the number of jobs that can be run concurrently

@Injectable()
export class MailJobRunner {

  constructor (
    private readonly provider: PgBossProvider,
    private readonly mailerService: MailerService
  ) {}

  async start() {
    await this.provider.get().subscribe(JOB_NAME, {
      teamSize: TEAM_SIZE, teamConcurrency: TEAM_CONCURRENCY
    }, this.handle)
  }

  handle = async (job) => {
    const mailJob: MailJob = job.data
    debug('sendMail: ', pick(mailJob, ['to', 'subject', 'text']))
    await this.mailerService.sendMail(mailJob)
  }
}