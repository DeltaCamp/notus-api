import { UseGuards, UnauthorizedException, Inject, forwardRef } from '@nestjs/common'
import { Mutation, Resolver, Query, Args, Parent, ResolveProperty } from '@nestjs/graphql'

import { GqlAuthGuard } from '../auth/GqlAuthGuard'
import { GqlAuthUser } from '../decorators/GqlAuthUser'
import {
  DappEntity,
  RecipeEntity,
  RecipeMatcherEntity
} from '../entities'
import { RecipeService } from './RecipeService'
import { RecipeDto } from './RecipeDto'
import { DappUserService } from '../dapp-users/DappUserService'

@Resolver(of => RecipeEntity)
export class RecipeResolver {

  constructor(
    private readonly recipeService: RecipeService,
    private readonly dappUserService: DappUserService
  ) {}

  @Query(returns => RecipeEntity)
  async recipe(@Args('id') id: string): Promise<RecipeEntity> {
    return await this.recipeService.findOne(id);
  }

  @Query(returns => [RecipeEntity])
  async recipes(): Promise<RecipeEntity[]> {
    return await this.recipeService.find();
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => RecipeEntity)
  async createRecipe(@GqlAuthUser() user, @Args('recipe') recipeDto: RecipeDto): Promise<RecipeEntity> {
    if (recipeDto.dapp.id) {
      await this.checkIsDappOwner(recipeDto.dapp.id, user.id)
    }
    return await this.recipeService.createRecipe(user, recipeDto)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => RecipeEntity)
  async updateRecipe(@GqlAuthUser() user, @Args('recipe') recipeDto: RecipeDto): Promise<RecipeEntity> {
    const recipe = await this.recipeService.findOneOrFail(recipeDto.id)
    await this.checkIsDappOwner(recipe.dappId, user.id)
    return await this.recipeService.update(recipe, recipeDto)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Boolean)
  async destroyRecipe(@GqlAuthUser() user, @Args('recipeId') recipeId: number): Promise<Boolean> {
    const recipe = await this.recipeService.findOneOrFail(recipeId)
    await this.checkIsDappOwner(recipe.dappId, user.id)
    await this.recipeService.destroy(recipe)
    return true
  }

  @ResolveProperty('recipeMatchers')
  async recipeMatchers(@Parent() recipe: RecipeEntity): Promise<RecipeMatcherEntity[]> {
    return await this.recipeService.getRecipeMatchers(recipe)
  }

  @ResolveProperty('dapp')
  async dapp(@Parent() recipe: RecipeEntity): Promise<DappEntity> {
    return await this.recipeService.getDapp(recipe)
  }

  async checkIsDappOwner(dappId: number, userId: number) {
    const isDappOwner = await this.dappUserService.isOwner(dappId, userId)
    if (!isDappOwner) {
      throw new UnauthorizedException()
    }
  }
}
