import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatcherEntity } from './MatcherEntity'
import { MatcherService } from './MatcherService'
import { EventTypeMatcherEntity } from '../event-type-matchers'
import { EventMatcherEntity } from '../event-matchers'


console.log('!!!!! MATCHER MODULE: ', TypeOrmModule)

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
