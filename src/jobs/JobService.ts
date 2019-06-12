import { Connection } from "typeorm";
import { InjectConnection } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Service } from "../Service";

import { JobEntity } from '../entities'
import { BlockJobsQuery } from "./BlockJobsQuery";
import { JobSummary } from "./JobSummary";

const debug = require('debug')('notus:jobs:JobService')

@Injectable()
export class JobService extends Service {
  
  constructor (
    @InjectConnection()
    connection: Connection
  ) {
    super(connection)
  }

  async findBlockJobs(blockJobsQuery: BlockJobsQuery): Promise<JobEntity[]> {
    let lastBlocks = this.lastBlockJobs(blockJobsQuery)

    let query = this.manager().createQueryBuilder()
      .select('job')
      .from(JobEntity, 'job')
      .addFrom(`(${lastBlocks.getQuery()})`, 'last_blocks')
      .setParameters(lastBlocks.getParameters())
      .where(`CAST(data -> 'blockNumber' AS INTEGER) = "last_blocks"."block_number" AND data -> 'chainId' = "last_blocks"."chain_id"`)

    query.printSql()

    // @ts-ignore
    return await query.getMany()
  }

  lastBlockJobs(blockJobsQuery: BlockJobsQuery) {
    let query = this.manager().createQueryBuilder(JobEntity, 'job')
      .select(`max(CAST( data -> 'blockNumber' AS INTEGER)) AS block_number, data -> 'chainId' as chain_id`)
      .where(`name = :name`, {
        name: 'BlockJob'
      })
      .groupBy('chain_id')

    if (blockJobsQuery.state !== undefined) {
      query = query.andWhere(`state = :state`, {
        state: blockJobsQuery.state
      })
    }

    if (blockJobsQuery.chainId !== undefined) {
      query = query.andWhere(`data -> 'chainId' = :chainId`, {
        chainId: blockJobsQuery.chainId
      })
    }

    return query
  }

  async summary(): Promise<JobSummary> {
    let query = this.manager().createQueryBuilder(JobEntity, 'job')
      .select(`COUNT(id) as count, state`)
      .groupBy('state')

    const jobSummary = new JobSummary()
    jobSummary.createdCount = 0
    jobSummary.activeCount = 0
    jobSummary.failedCount = 0
    jobSummary.completedCount = 0

    const result = await query.getRawMany()

    result.forEach(row => {
      switch(row.state) {
        case 'created':
          jobSummary.createdCount = parseInt(row.count, 10)
          break
        case 'active':
          jobSummary.activeCount = parseInt(row.count, 10)
          break
        case 'completed':
          jobSummary.completedCount = parseInt(row.count, 10)
          break
        case 'failed':
          jobSummary.failedCount = parseInt(row.count, 10)
          break
      }
    })

    console.log(result, jobSummary)
    
    return jobSummary
  }
}