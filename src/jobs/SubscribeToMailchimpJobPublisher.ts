import { Injectable } from '@nestjs/common'

import { PgBossProvider } from './PgBossProvider';
import { SUBSCRIBE_TO_MAILCHIMP_JOB_NAME, SubscribeToMailchimpJob } from './SubscribeToMailchimpJob'

@Injectable()
export class SubscribeToMailchimpJobPublisher {

  constructor (
    private readonly provider: PgBossProvider
  ) {}

  async publish(job: SubscribeToMailchimpJob) {
    await this.provider.get().publish(SUBSCRIBE_TO_MAILCHIMP_JOB_NAME, job)
  }
}