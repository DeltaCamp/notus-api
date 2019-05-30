import { Injectable } from '@nestjs/common'

import { SLACK_DELTA_CAMP_JOB_NAME, SlackDeltaCampJob } from './SlackDeltaCampJob'
import { PgBossProvider } from './PgBossProvider';

const debug = require('debug')('notus:jobs:SlackDeltaCampJobRunner')
const axios = require('axios')

@Injectable()
export class SlackDeltaCampJobRunner {

  constructor (
    private readonly provider: PgBossProvider
  ) {}

  start() {
    this.provider.get().subscribe(SLACK_DELTA_CAMP_JOB_NAME, this.handleSlackDeltaCampJob)
  }

  handleSlackDeltaCampJob = async (job: any) => {
    if (process.env.SEND_SLACK_NOTIFICATIONS !== 'true') {
      debug('SEND_SLACK_NOTIFICATIONS is not defined.  Ignoring subscription.')
      return
    }

    let SlackDeltaCampJob: SlackDeltaCampJob = job.data
    debug(`handleSlackDeltaCampJob`)

    try {
      const config = {
        timeout: 3000,
        // headers: [
        //   'Content-type: application/json'
        // ]
      }

      const url = `https://hooks.slack.com/services/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`
      const text = `Somebody just signed up with the email '${SlackDeltaCampJob.email}'!`
      // const postParams = { params: { text } }
      const postParams = { text }

      const runAxiosPost = async () => {
        try {
          const response = await axios.post(
            url,
            postParams,
            config
          )
        
          debug('Message sent: ', response);
        } catch (e) {
          // console.error(e)
          console.error(e.response.status)
          console.error(e.response.statusText)
          throw e         
        }
      }

      runAxiosPost()
    } catch (error) {
      console.error(error)
      throw error
    }

  }
}