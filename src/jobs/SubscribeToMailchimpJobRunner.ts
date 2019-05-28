import { Injectable } from '@nestjs/common'

import { SUBSCRIBE_TO_MAILCHIMP_JOB_NAME, SubscribeToMailchimpJob } from './SubscribeToMailchimpJob'
import { PgBossProvider } from './PgBossProvider';

const debug = require('debug')('notus:jobs:SubscribeToMailchimpJobRunner')

const Mailchimp = require('mailchimp-api-v3')

const mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);

@Injectable()
export class SubscribeToMailchimpJobRunner {

  constructor (
    private readonly provider: PgBossProvider
  ) {}

  start() {
    this.provider.get().subscribe(SUBSCRIBE_TO_MAILCHIMP_JOB_NAME, this.handleSubscribeToMailchimpJob)
  }

  handleSubscribeToMailchimpJob = async (job: any) => {
    let subscribeToMailchimpJob: SubscribeToMailchimpJob = job.data
    debug(`handleSubscribeToMailchimpJob`)
    try {
      mailchimp.request({
        method: 'post',
        path: `/lists/${process.env.MAILCHIMP_LIST_ID}/members/`,
        body: {
          "email_address": subscribeToMailchimpJob.email,
          "status": "subscribed"
        }
      })
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}