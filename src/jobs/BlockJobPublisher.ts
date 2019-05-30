import { Injectable } from '@nestjs/common'

import { BLOCK_JOB_NAME, BlockJob } from './BlockJob'
import { PgBossProvider } from './PgBossProvider'

const debug = require('debug')('notus:jobs:BlockJobPublisher')

@Injectable()
export class BlockJobPublisher {

  constructor (
    private readonly provider: PgBossProvider
  ) {}

  async newBlock(blockJob: BlockJob): Promise<string> {
    return await this.provider.get().publish(BLOCK_JOB_NAME, blockJob, { retryLimit: 2, expireIn: '5 minutes' })
  }

}
