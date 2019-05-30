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
import { SlackDeltaCampJobRunner } from './SlackDeltaCampJobRunner'
import { SlackDeltaCampJobPublisher } from './SlackDeltaCampJobPublisher'

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
    SubscribeToMailchimpJobPublisher,
    SlackDeltaCampJobRunner,
    SlackDeltaCampJobPublisher
  ],

  exports: [
    PgBossProvider,
    JobRunnerManager,
    MailJobPublisher,
    BlockJobPublisher,
    WebhookJobPublisher,
    SubscribeToMailchimpJobPublisher,
    SlackDeltaCampJobPublisher
  ]
})
export class JobModule {}
