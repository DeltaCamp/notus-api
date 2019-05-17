import { Injectable } from '@nestjs/common'

import { PgBossProvider } from './PgBossProvider';
import { WEBHOOK_JOB_NAME, WebhookJob } from './WebhookJob'

const debug = require('debug')('notus:jobs:WebhookJobRunner')
const axios = require('axios')

@Injectable()
export class WebhookJobRunner {

  constructor (
    private readonly provider: PgBossProvider
  ) {}

  async start() {
    await this.provider.get().subscribe(WEBHOOK_JOB_NAME, this.handle)
  }

  handle = async (job: any) => {
    const webhookJob: WebhookJob = job.data
    const config = {
      timeout: 1000,
      headers: webhookJob.headers
    }
    debug('handle: ', webhookJob)
    if (webhookJob.body) {
      axios.post(webhookJob.url, webhookJob.body, config)
    } else {
      axios.get(webhookJob.url, config)
    }
  }
}