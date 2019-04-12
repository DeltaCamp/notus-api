import { Field, InputType, ID } from 'type-graphql';
import { MatcherDto } from '../matchers'

@InputType()
export class RecipeMatcherDto {
  @Field(type => ID, { nullable: true })
  id: number;

  @Field({ nullable: true })
  recipeId: number;

  @Field(type => MatcherDto)
  matcher: MatcherDto;
}
