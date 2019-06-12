import { UseFilters } from '@nestjs/common'
import { Resolver, Args, Query } from '@nestjs/graphql'

import { GqlRollbarExceptionFilter } from '../filters/GqlRollbarExceptionFilter';
import { JobsQueryResponse } from './JobsQueryResponse';
import {
  JobEntity
} from '../entities'
import { JobService } from './JobService'
import { BlockJobsQuery } from './BlockJobsQuery';

const debug = require('debug')('notus:JobResolver')

@UseFilters(new GqlRollbarExceptionFilter())
@Resolver(of => JobEntity)
export class JobResolver {

  constructor(
    private readonly jobService: JobService
  ) {}

  @Query(returns => JobsQueryResponse)
  async blockJobs(
    @Args({ name: 'blockJobsQuery', type: () => BlockJobsQuery }) blockJobsQuery: BlockJobsQuery
  ): Promise<JobsQueryResponse> {
    const result = new JobsQueryResponse()
    const jobEntities = await this.jobService.findBlockJobs(blockJobsQuery)
    result.jobs = jobEntities
    return result
  }

}
