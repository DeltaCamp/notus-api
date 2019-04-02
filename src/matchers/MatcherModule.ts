import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatcherEntity } from './MatcherEntity'
import { MatcherService } from './MatcherService'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MatcherEntity
    ])
  ],

  providers: [
    MatcherService
  ],

  exports: [
    MatcherService
  ]
})
export class MatcherModule {}
