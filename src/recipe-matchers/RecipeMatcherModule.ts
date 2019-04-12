import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatcherModule } from '../matchers'
import { RecipeMatcherEntity } from '../entities'
import { RecipeMatcherService } from './RecipeMatcherService'
import { RecipeMatcherResolver } from './RecipeMatcherResolver'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RecipeMatcherEntity
    ])
  ],

  providers: [
    RecipeMatcherService, RecipeMatcherResolver
  ],

  exports: [
    RecipeMatcherService
  ]
})
export class RecipeMatcherModule {}
