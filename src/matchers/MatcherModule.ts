import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatcherEntity } from '../entities'
import { MatcherService } from './MatcherService'
import { MatcherResolver } from './MatcherResolver'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MatcherEntity
    ])
  ],

  providers: [
    MatcherService,
    MatcherResolver
  ],

  exports: [
    MatcherService
  ]
})
export class MatcherModule {}
