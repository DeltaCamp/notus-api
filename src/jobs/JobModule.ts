import { Module } from '@nestjs/common'

import { PgBossProvider } from './PgBossProvider'
import { MailJobRunner } from './MailJobRunner'
import { JobRunnerManager } from './JobRunnerManager'
import { MailJobPublisher } from './MailJobPublisher';

@Module({
  providers: [
    PgBossProvider, MailJobRunner, JobRunnerManager, MailJobPublisher
  ],

  exports: [
    PgBossProvider, JobRunnerManager, MailJobPublisher
  ]
})
export class JobModule {}
