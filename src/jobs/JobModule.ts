import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobEntity } from '../entities'
import { JobService } from './JobService'
import { JobResolver } from './JobResolver'
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
  imports: [
    TypeOrmModule.forFeature([
      JobEntity
    ])
  ],

  providers: [
    JobResolver,
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
    SlackDeltaCampJobPublisher,
    JobService
  ],

  exports: [
    PgBossProvider,
    JobRunnerManager,
    MailJobPublisher,
    BlockJobPublisher,
    WebhookJobPublisher,
    SubscribeToMailchimpJobPublisher,
    SlackDeltaCampJobPublisher,
    JobService
  ]
})
export class JobModule {}
