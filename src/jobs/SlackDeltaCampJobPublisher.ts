import { Injectable } from '@nestjs/common'

import { PgBossProvider } from './PgBossProvider';
import { SLACK_DELTA_CAMP_JOB_NAME, SlackDeltaCampJob } from './SlackDeltaCampJob'

@Injectable()
export class SlackDeltaCampJobPublisher {

  constructor (
    private readonly provider: PgBossProvider
  ) {}

  async publish(job: SlackDeltaCampJob) {
    await this.provider.get().publish(SLACK_DELTA_CAMP_JOB_NAME, job)
  }
}