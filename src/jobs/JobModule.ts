import { Module } from '@nestjs/common'

import { PgBossProvider } from './PgBossProvider'
import { MailJobRunner } from './MailJobRunner'
import { BlockJobRunner } from './BlockJobRunner'
import { JobRunnerManager } from './JobRunnerManager'
import { MailJobPublisher } from './MailJobPublisher';
import { BlockJobPublisher } from './BlockJobPublisher'

@Module({
  providers: [
    PgBossProvider, MailJobRunner, JobRunnerManager, MailJobPublisher, BlockJobRunner, BlockJobPublisher
  ],

  exports: [
    PgBossProvider, JobRunnerManager, MailJobPublisher, BlockJobPublisher
  ]
})
export class JobModule {}
