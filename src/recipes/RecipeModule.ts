import {
  Module
} from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

import { RecipeEntity } from '../entities'
import { RecipeResolver } from './RecipeResolver'
import { RecipeService } from './RecipeService'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RecipeEntity,
    ])
  ],
  providers: [
    RecipeResolver, RecipeService
  ],

  exports: [
    RecipeService
  ]
})
export class RecipeModule {}
