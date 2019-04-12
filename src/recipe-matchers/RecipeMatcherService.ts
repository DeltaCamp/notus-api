import { Injectable, Inject, forwardRef } from '@nestjs/common'

import { MatcherEntity, RecipeEntity, RecipeMatcherEntity } from '../entities'
import { MatcherService } from '../matchers/MatcherService'
import { MatcherDto } from '../matchers/MatcherDto'
import { Transaction } from '../typeorm/Transaction'
import { EntityManagerProvider } from '../typeorm/EntityManagerProvider'
import { RecipeMatcherDto } from './RecipeMatcherDto'

@Injectable()
export class RecipeMatcherService {

  constructor (
    private readonly provider: EntityManagerProvider,
    private readonly matcherService: MatcherService
  ) {}

  @Transaction()
  async createRecipeMatcher(recipe: RecipeEntity, matcherDto: MatcherDto): Promise<RecipeMatcherEntity> {
    const recipeMatcher = new RecipeMatcherEntity()
    recipeMatcher.recipe = recipe
    recipeMatcher.matcher = await this.matcherService.createMatcher(matcherDto)
    this.provider.get().save(recipeMatcher)

    return recipeMatcher
  }

  @Transaction()
  async update(recipeMatcherDto: RecipeMatcherDto): Promise<RecipeMatcherEntity> {
    await this.matcherService.update(recipeMatcherDto.matcher)
    return await this.findOneOrFail(recipeMatcherDto.id)
  }

  @Transaction()
  async findOneOrFail(recipeMatcherId: number): Promise<RecipeMatcherEntity> {
    return await this.provider.get().findOneOrFail(RecipeMatcherEntity, recipeMatcherId)
  }

  @Transaction()
  async destroy(recipeMatcher: RecipeMatcherEntity) {
    await this.matcherService.destroy(recipeMatcher.matcherId)
    await this.provider.get().delete(RecipeMatcherEntity, recipeMatcher.id)
  }

  @Transaction()
  async getMatcher(recipeMatcher: RecipeMatcherEntity): Promise<MatcherEntity> {
    return await this.matcherService.findOne(recipeMatcher.matcherId)
  }
}
