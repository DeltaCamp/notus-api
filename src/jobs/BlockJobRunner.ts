import { Injectable } from '@nestjs/common'

import { BLOCK_JOB_NAME, BlockJob } from './BlockJob'
import { PgBossProvider } from './PgBossProvider';
import { BlockHandler } from '../engine/BlockHandler'

const debug = require('debug')('notus:jobs:BlockJobRunner')

@Injectable()
export class BlockJobRunner {

  constructor (
    private readonly provider: PgBossProvider,
    private readonly blockHandler: BlockHandler
  ) {}

  start() {
    this.provider.get().subscribe(BLOCK_JOB_NAME, this.handleBlockJob)
  }

  handleBlockJob = async (job: any) => {
    let blockJob: BlockJob = job.data
    debug(`handleBlockJob ${blockJob.blockNumber}`)
    try {
      await this.blockHandler.handle(blockJob.networkName, blockJob.blockNumber)
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}