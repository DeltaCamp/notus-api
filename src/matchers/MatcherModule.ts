import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatcherEntity } from '../entities'
import { MatcherService } from './MatcherService'
import { SourceResolver } from './SourceResolver'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MatcherEntity
    ])
  ],

  providers: [
    MatcherService, SourceResolver
  ],

  exports: [
    MatcherService
  ]
})
export class MatcherModule {}
