import { Injectable } from '@nestjs/common'

import { SUBSCRIBE_TO_MAILCHIMP_JOB_NAME, SubscribeToMailchimpJob } from './SubscribeToMailchimpJob'
import { PgBossProvider } from './PgBossProvider';

const debug = require('debug')('notus:jobs:SubscribeToMailchimpJobRunner')

const Mailchimp = require('mailchimp-api-v3')

let mailchimp = null

function getMailchimp() {
  if (!mailchimp) {
    mailchimp = new Mailchimp(process.env.MAILCHIMP_API_KEY);
  }
  return mailchimp
}

@Injectable()
export class SubscribeToMailchimpJobRunner {

  constructor (
    private readonly provider: PgBossProvider
  ) {}

  start() {
    this.provider.get().subscribe(SUBSCRIBE_TO_MAILCHIMP_JOB_NAME, this.handleSubscribeToMailchimpJob)
  }

  handleSubscribeToMailchimpJob = async (job: any) => {
    if (!process.env.MAILCHIMP_LIST_ID) {
      debug('MAILCHIMP_LIST_ID is not defined.  Ignoring subscription.')
      return
    }
    if (!process.env.MAILCHIMP_API_KEY) {
      debug('MAILCHIMP_API_KEY is not defined.  Ignoring subscription.')
      return
    }
    const mailchimp = getMailchimp()
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