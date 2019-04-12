import { Field, InputType, ID } from 'type-graphql';

import { MatcherDto } from '../matchers/MatcherDto';

@InputType()
export class EventDto {
  @Field(type => ID, { nullable: true })
  id?: number;

  @Field()
  recipeId: number;

  @Field(type => [MatcherDto])
  matchers: MatcherDto[];
}
