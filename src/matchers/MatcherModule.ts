import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatcherEntity } from '../entities'
import { MatcherService } from './MatcherService'
import { MatcherResolver } from './MatcherResolver'
import { SourceResolver } from './SourceResolver'
import { MetaDataTypeResolver } from './MetaDataTypeResolver'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MatcherEntity
    ])
  ],

  providers: [
    MatcherService, SourceResolver, MatcherResolver, MetaDataTypeResolver
  ],

  exports: [
    MatcherService
  ]
})
export class MatcherModule {}
