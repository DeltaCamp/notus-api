import { Injectable, Inject, forwardRef } from '@nestjs/common';

import {
  DappEntity,
  RecipeEntity,
  UserEntity,
  RecipeMatcherEntity
} from '../entities'
import { RecipeMatcherService } from '../recipe-matchers/RecipeMatcherService'
import { RecipeDto } from './RecipeDto'
import { EventService } from '../events/EventService'
import { DappService } from '../dapps/DappService'
import { Transaction, EntityManagerProvider } from '../typeorm'

@Injectable()
export class RecipeService {

  constructor (
    private readonly provider: EntityManagerProvider,
    private readonly recipeMatcherService: RecipeMatcherService,
    private readonly eventService: EventService,
    @Inject(forwardRef(() => DappService))
    private readonly dappService: DappService
  ) {}

  @Transaction()
  async findOne(id): Promise<RecipeEntity> {
    return this.provider.get().findOne(RecipeEntity, id)
  }

  @Transaction()
  async find(): Promise<RecipeEntity[]> {
    return this.provider.get().find(RecipeEntity)
  }

  @Transaction()
  async findOneOrFail(id): Promise<RecipeEntity> {
    return this.provider.get().findOneOrFail(RecipeEntity, id)
  }

  @Transaction()
  async createRecipe(user: UserEntity, recipeDto: RecipeDto): Promise<RecipeEntity> {

    const recipe = new RecipeEntity()
    recipe.dapp = await this.dappService.findOrCreate(user, recipeDto.dapp)
    recipe.name = recipeDto.name

    await this.provider.get().save(recipe)

    recipe.recipeMatchers = await Promise.all(recipeDto.matchers.map(matcherDto => (
      this.recipeMatcherService.createRecipeMatcher(recipe, matcherDto)
    )))

    return recipe
  }

  @Transaction()
  async update(recipe: RecipeEntity, recipeDto: RecipeDto): Promise<RecipeEntity> {
    recipe.name = recipeDto.name
    await this.provider.get().save(recipe)
    return recipe
  }

  @Transaction()
  async destroy(recipe: RecipeEntity) {
    await Promise.all(recipe.recipeMatchers.map((recipeMatcher) => {
      return this.recipeMatcherService.destroy(recipeMatcher)
    }))

    await Promise.all(recipe.events.map((event) => {
      return this.eventService.destroy(event)
    }))

    await this.provider.get().delete(RecipeEntity, recipe.id)
  }

  @Transaction()
  async getRecipeMatchers(recipe: RecipeEntity): Promise<RecipeMatcherEntity[]> {
    return this.provider.get().createQueryBuilder()
      .select('recipe_matchers')
      .from(RecipeMatcherEntity, 'recipe_matchers')
      .innerJoin('recipe_matchers.recipe', 'recipes')
      .where('recipes.id = :id', { id: recipe.id })
      .getMany()
  }

  @Transaction()
  async getDapp(recipe: RecipeEntity): Promise<DappEntity> {
    return this.provider.get().createQueryBuilder()
      .select('dapps')
      .from(DappEntity, 'dapps')
      .innerJoin('dapps.recipes', 'recipes')
      .where('recipes.id = :id', { id: recipe.id })
      .printSql()
      .getOne()
  }
}
