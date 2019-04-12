import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  RelationId
} from 'typeorm';
import { Field, Int, ObjectType, ID } from 'type-graphql';

import {
  MatcherEntity,
  RecipeEntity
} from '../entities'

@ObjectType()
@Entity({ name: 'recipe_matchers' })
export class RecipeMatcherEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(type => RecipeEntity)
  @ManyToOne(type => RecipeEntity, {
    nullable: false
  })
  recipe: RecipeEntity;

  @RelationId((recipeMatcher: RecipeMatcherEntity) => recipeMatcher.recipe)
  recipeId: number;

  @Field(type => MatcherEntity)
  @ManyToOne(type => MatcherEntity, {
    nullable: false
  })
  matcher: MatcherEntity;

  @RelationId((recipeMatcher: RecipeMatcherEntity) => recipeMatcher.matcher)
  matcherId: number;
}
