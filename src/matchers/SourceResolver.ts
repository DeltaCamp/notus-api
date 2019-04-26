import { UseGuards, UnauthorizedException, Inject, forwardRef, NotFoundException, UseFilters } from '@nestjs/common'
import { Resolver, Query, Args } from '@nestjs/graphql'

import * as Source from './Source'
import { SourceDataType } from './SourceDataType'
import { SourceTitle } from './SourceTitle'
import { SourceEntity } from './SourceEntity'
import { GqlRollbarExceptionFilter } from '../filters/GqlRollbarExceptionFilter';

@UseFilters(new GqlRollbarExceptionFilter())
@Resolver(of => SourceEntity)
export class SourceResolver {

  @Query(returns => SourceEntity)
  source(@Args('source') source: string): SourceEntity {
    const sourceEntity = new SourceEntity()
    sourceEntity.source = source
    sourceEntity.title = SourceTitle[source]
    sourceEntity.dataType = SourceDataType[source]
    if (!sourceEntity.title) {
      throw new NotFoundException()
    }
    return sourceEntity
  }

  @Query(returns => [SourceEntity])
  sources(): SourceEntity[] {
    return Object.values(Source).map(source => {
      const sourceEntity = new SourceEntity()
      sourceEntity.source = source;
      sourceEntity.title = SourceTitle[source];
      sourceEntity.dataType = SourceDataType[source];
      return sourceEntity
    })
  }

}
