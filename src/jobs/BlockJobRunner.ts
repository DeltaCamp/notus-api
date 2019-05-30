import { Injectable } from '@nestjs/common'

import { BLOCK_JOB_NAME, BlockJob } from './BlockJob'
import { PgBossProvider } from './PgBossProvider';
import { BlockHandler } from '../engine/BlockHandler'

const debug = require('debug')('notus:jobs:BlockJobRunner')

const TEAM_SIZE = 10 // the number of jobs to fetch per polling period
const TEAM_CONCURRENCY = 2 // the number of jobs that can be run concurrently

@Injectable()
export class BlockJobRunner {

  constructor (
    private readonly provider: PgBossProvider,
    private readonly blockHandler: BlockHandler
  ) {}

  start() {
    this.provider.get().subscribe(BLOCK_JOB_NAME, {
      teamSize: TEAM_SIZE, teamConcurrency: TEAM_CONCURRENCY
    }, this.handleBlockJob)
  }

  handleBlockJob = async (job: any) => {
    let blockJob: BlockJob = job.data
    debug(`handleBlockJob ${blockJob.networkName} ${blockJob.chainId}: block ${blockJob.blockNumber} >>>>>>>>>>>`)
    try {
      const startTime = new Date()
      await this.blockHandler.handle(blockJob.networkName, blockJob.blockNumber)
      debug(`<<<<<<< duration (ms): ${(new Date()).getTime() - startTime.getTime()}`)
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}