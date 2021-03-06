import { Injectable } from '@nestjs/common'

import { PgBossProvider } from './PgBossProvider'
import { MailJobRunner } from './MailJobRunner'
import { BlockJobRunner } from './BlockJobRunner';
import { WebhookJobRunner } from './WebhookJobRunner';
import { SubscribeToMailchimpJobRunner } from './SubscribeToMailchimpJobRunner';
import { SlackDeltaCampJobRunner } from './SlackDeltaCampJobRunner';

@Injectable()
export class JobRunnerManager {

  constructor (
    private readonly provider: PgBossProvider,
    private readonly mailJobRunner: MailJobRunner,
    private readonly blockJobRunner: BlockJobRunner,
    private readonly webhookJobRunner: WebhookJobRunner,
    private readonly subscribeToMailchimpJobRunner: SubscribeToMailchimpJobRunner,
    private readonly slackDeltaCampJobRunner: SlackDeltaCampJobRunner
  ) {}

  async start() {
    await this.provider.get().start()
    await Promise.all([
      this.mailJobRunner.start(),
      this.blockJobRunner.start(),
      this.webhookJobRunner.start(),
      this.subscribeToMailchimpJobRunner.start(),
      this.slackDeltaCampJobRunner.start()
    ])
  }

}