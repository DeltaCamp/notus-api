import { NotFoundException, UseFilters } from '@nestjs/common'
import { Resolver, Query, Args } from '@nestjs/graphql'

import * as Source from './Source'
import { SourceDataType } from './SourceDataType'
import { SourceTitle } from './SourceTitle'
import { SourceEntity } from './SourceEntity'
import { SourceMetaDataType } from './SourceMetaDataType'
import { GqlRollbarExceptionFilter } from '../filters/GqlRollbarExceptionFilter';

const debug = require('debug')('notus:matchers:SourceResolver')

@UseFilters(new GqlRollbarExceptionFilter())
@Resolver(of => SourceEntity)
export class SourceResolver {

  @Query(returns => SourceEntity)
  source(@Args('source') source: string): SourceEntity {
    const sourceEntity = this.buildSourceEntity(source)
    if (!sourceEntity.title) {
      throw new NotFoundException()
    }
    return sourceEntity
  }

  @Query(returns => [SourceEntity])
  sources(): SourceEntity[] {
    return Object.values(Source).map(source => this.buildSourceEntity(source))
  }

  buildSourceEntity(source: string): SourceEntity {
    const sourceEntity = new SourceEntity()
    sourceEntity.source = source;
    sourceEntity.title = SourceTitle[source];
    sourceEntity.dataType = SourceDataType[source];
    sourceEntity.metaDataType = SourceMetaDataType[source]
    return sourceEntity
  }
}
