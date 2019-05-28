import { Module } from '@nestjs/common'

import { PgBossProvider } from './PgBossProvider'
import { MailJobRunner } from './MailJobRunner'
import { BlockJobRunner } from './BlockJobRunner'
import { JobRunnerManager } from './JobRunnerManager'
import { MailJobPublisher } from './MailJobPublisher';
import { BlockJobPublisher } from './BlockJobPublisher'
import { WebhookJobRunner } from './WebhookJobRunner'
import { WebhookJobPublisher } from './WebhookJobPublisher'
import { SubscribeToMailchimpJobRunner } from './SubscribeToMailchimpJobRunner'
import { SubscribeToMailchimpJobPublisher } from './SubscribeToMailchimpJobPublisher'

@Module({
  providers: [
    PgBossProvider,
    MailJobRunner,
    JobRunnerManager,
    MailJobPublisher,
    BlockJobRunner,
    BlockJobPublisher,
    WebhookJobRunner,
    WebhookJobPublisher,
    SubscribeToMailchimpJobRunner,
    SubscribeToMailchimpJobPublisher
  ],

  exports: [
    PgBossProvider,
    JobRunnerManager,
    MailJobPublisher,
    BlockJobPublisher,
    WebhookJobPublisher,
    SubscribeToMailchimpJobPublisher
  ]
})
export class JobModule {}
