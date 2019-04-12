import { Field, InputType, ID } from 'type-graphql';

import { DappDto } from '../dapps/DappDto'
import { MatcherDto } from '../matchers/MatcherDto'

@InputType()
export class RecipeDto {
  @Field(type => ID, { nullable: true })
  id?: number;

  @Field(type => DappDto)
  dapp: DappDto;

  @Field()
  name: string = '';

  @Field(type => [MatcherDto])
  matchers: MatcherDto[];
}
