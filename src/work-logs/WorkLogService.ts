import { Injectable } from '@nestjs/common'

import { Transaction, EntityManagerProvider } from '../transactions'
import { WorkLogEntity } from './WorkLogEntity';

@Injectable()
export class WorkLogService {

  constructor (
    private readonly provider: EntityManagerProvider
  ) {}

  @Transaction()
  async setLastBlock(chainId: number, blockNumber: number) {
    let workLog = await this.findOrCreate(chainId)
    if (workLog.lastCompletedBlockNumber < blockNumber) {
      workLog.lastCompletedBlockNumber = blockNumber
      await this.provider.get().save(workLog)
    }
  }

  async getLastBlock(chainId: number): Promise<number> {
    let workLog = await this.findOrCreate(chainId)
    return workLog.lastCompletedBlockNumber
  }

  async findOrCreate(chainId: number): Promise<WorkLogEntity> {
    let workLog: WorkLogEntity = await this.provider.get().findOne(WorkLogEntity, { chainId })
    if (!workLog) {
      workLog = new WorkLogEntity()
      workLog.chainId = chainId
      workLog.lastCompletedBlockNumber = 0
    }

    return workLog
  }

}