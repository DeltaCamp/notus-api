import { Injectable } from '@nestjs/common'

import { BLOCK_JOB_NAME, BlockJob } from './BlockJob'
import { PgBossProvider } from './PgBossProvider';
import { BlockHandler } from '../engine/BlockHandler'

const debug = require('debug')('notus:jobs:BlockJobRunner')

const CONCURRENCY = 10

@Injectable()
export class BlockJobRunner {

  constructor (
    private readonly provider: PgBossProvider,
    private readonly blockHandler: BlockHandler
  ) {}

  start() {
    this.provider.get().subscribe(BLOCK_JOB_NAME, {
      teamSize: CONCURRENCY, teamConcurrency: CONCURRENCY
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