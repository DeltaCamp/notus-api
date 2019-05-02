import { Injectable } from '@nestjs/common'

import { PgBossProvider } from './PgBossProvider';
import { WEBHOOK_JOB_NAME, WebhookJob } from './WebhookJob'

@Injectable()
export class WebhookJobPublisher {

  constructor (
    private readonly provider: PgBossProvider
  ) {}

  async publish(webhookJob: WebhookJob) {
    await this.provider.get().publish(WEBHOOK_JOB_NAME, webhookJob)
  }
}