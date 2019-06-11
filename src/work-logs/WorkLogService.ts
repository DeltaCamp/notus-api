import { Injectable } from '@nestjs/common'

import { WorkLogEntity } from './WorkLogEntity';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { Service } from '../Service';

@Injectable()
export class WorkLogService extends Service {

  constructor (
    @InjectConnection()
    connection: Connection,
  ) {
    super(connection)
  }

  async setLastBlock(chainId: number, blockNumber: number) {
    let workLog = await this.findOrCreate(chainId)
    if (workLog.lastCompletedBlockNumber < blockNumber) {
      workLog.lastCompletedBlockNumber = blockNumber
      await this.manager().save(workLog)
    }
  }

  async getLastBlock(chainId: number): Promise<number> {
    let workLog = await this.findOrCreate(chainId)
    return workLog.lastCompletedBlockNumber
  }

  async findOrCreate(chainId: number): Promise<WorkLogEntity> {
    let workLog: WorkLogEntity = await this.manager().findOne(WorkLogEntity, { chainId })
    if (!workLog) {
      workLog = new WorkLogEntity()
      workLog.chainId = chainId
      workLog.lastCompletedBlockNumber = 0
    }

    return workLog
  }

}