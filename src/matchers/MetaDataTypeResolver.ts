import { NotFoundException, UseFilters } from '@nestjs/common'
import { Resolver, Query, Args } from '@nestjs/graphql'

import { MetaDataType } from './MetaDataType'
import { MetaDataTypeTitle } from './MetaDataTypeTitle'
import { MetaDataTypeEntity } from './MetaDataTypeEntity'
import { GqlRollbarExceptionFilter } from '../filters/GqlRollbarExceptionFilter';

@UseFilters(new GqlRollbarExceptionFilter())
@Resolver(of => MetaDataTypeEntity)
export class MetaDataTypeResolver {

  @Query(returns => MetaDataTypeEntity)
  metaDataType(@Args('metaDataType') metaDataType: string): MetaDataTypeEntity {
    const metaDataTypeEntity = this.buildMetaDataTypeEntity(metaDataType)
    if (!metaDataTypeEntity.title) {
      throw new NotFoundException()
    }
    return metaDataTypeEntity
  }

  @Query(returns => [MetaDataTypeEntity])
  metaDataTypes(): MetaDataTypeEntity[] {
    return Object.values(MetaDataType).map(metaDataType => this.buildMetaDataTypeEntity(metaDataType))
  }

  buildMetaDataTypeEntity(metaDataType: string): MetaDataTypeEntity {
    const metaDataTypeEntity = new MetaDataTypeEntity()
    metaDataTypeEntity.metaDataType = metaDataType;
    metaDataTypeEntity.title = MetaDataTypeTitle[metaDataType];
    return metaDataTypeEntity
  }
}
