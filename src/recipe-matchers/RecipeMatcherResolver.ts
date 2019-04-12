import { UseGuards, UnauthorizedException, Inject, forwardRef } from '@nestjs/common'
import { Mutation, Resolver, Query, Args, ResolveProperty, Parent } from '@nestjs/graphql'

import { GqlAuthGuard } from '../auth/GqlAuthGuard'
import { GqlAuthUser } from '../decorators/GqlAuthUser'
import {
  UserEntity,
  RecipeEntity,
  MatcherEntity,
  RecipeMatcherEntity
} from '../entities'
import { RecipeMatcherDto } from './RecipeMatcherDto'
import { RecipeMatcherService } from './RecipeMatcherService'
import { RecipeService } from '../recipes/RecipeService'
import { DappUserService } from '../dapp-users/DappUserService'

@Resolver(of => RecipeMatcherEntity)
export class RecipeMatcherResolver {

  constructor(
    private readonly recipeService: RecipeService,
    private readonly dappUserService: DappUserService,
    private readonly recipeMatcherService: RecipeMatcherService
  ) {}

  @ResolveProperty('matcher')
  async matcher(@Parent() event: RecipeMatcherEntity): Promise<MatcherEntity> {
    return await this.recipeMatcherService.getMatcher(event)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => RecipeMatcherEntity)
  async createRecipeMatcher(
    @GqlAuthUser() user: UserEntity,
    @Args('recipeMatcher') recipeMatcherDto: RecipeMatcherDto
  ): Promise<RecipeMatcherEntity> {
    const recipe = await this.getRecipe(user, recipeMatcherDto.recipeId)
    return await this.recipeMatcherService.createRecipeMatcher(recipe, recipeMatcherDto.matcher)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => RecipeMatcherEntity)
  async updateRecipeMatcher(
    @GqlAuthUser() user: UserEntity,
    @Args('recipeMatcher') recipeMatcherDto: RecipeMatcherDto
  ): Promise<RecipeMatcherEntity> {
    const recipe = await this.getRecipe(user, recipeMatcherDto.recipeId)
    return await this.recipeMatcherService.update(recipeMatcherDto)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => RecipeMatcherEntity)
  async destroyRecipeMatcher(
    @GqlAuthUser() user: UserEntity,
    @Args('recipeMatcherId') recipeMatcherId: number
  ): Promise<Boolean> {
    const recipeMatcher = await this.recipeMatcherService.findOneOrFail(recipeMatcherId)
    const recipe = await this.getRecipe(user, recipeMatcher.recipeId)
    await this.recipeMatcherService.destroy(recipeMatcher)
    return true
  }

  async getRecipe(user: UserEntity, recipeId: number): Promise<RecipeEntity> {
    const recipe = await this.recipeService.findOneOrFail(recipeId)
    const isDappOwner = await this.dappUserService.isOwner(recipe.dappId, user.id)
    if (!isDappOwner) {
      throw new UnauthorizedException()
    }
    return recipe
  }
}
