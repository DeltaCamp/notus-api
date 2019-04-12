import { UseGuards, UnauthorizedException, Inject, forwardRef } from '@nestjs/common'
import { Resolver, Query, Args } from '@nestjs/graphql'

import * as Source from './Source'
import { SourceDataType } from './SourceDataType'
import { SourceTitle } from './SourceTitle'
import { SourceEntity } from './SourceEntity'

@Resolver(of => SourceEntity)
export class SourceResolver {

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
