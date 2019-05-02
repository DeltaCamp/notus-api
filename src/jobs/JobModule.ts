import { Module } from '@nestjs/common'

import { PgBossProvider } from './PgBossProvider'
import { MailJobRunner } from './MailJobRunner'
import { BlockJobRunner } from './BlockJobRunner'
import { JobRunnerManager } from './JobRunnerManager'
import { MailJobPublisher } from './MailJobPublisher';
import { BlockJobPublisher } from './BlockJobPublisher'
import { WebhookJobRunner } from './WebhookJobRunner'
import { WebhookJobPublisher } from './WebhookJobPublisher'

@Module({
  providers: [
    PgBossProvider, MailJobRunner, JobRunnerManager, MailJobPublisher, BlockJobRunner, BlockJobPublisher, WebhookJobRunner, WebhookJobPublisher
  ],

  exports: [
    PgBossProvider, JobRunnerManager, MailJobPublisher, BlockJobPublisher, WebhookJobPublisher
  ]
})
export class JobModule {}
