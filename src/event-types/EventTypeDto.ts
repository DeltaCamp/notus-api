import { Field, InputType, ID } from 'type-graphql';

import { MatcherDto } from '../matchers/MatcherDto'
import { VariableDto } from '../variables/VariableDto'

@InputType()
export class EventTypeDto {
  @Field(type => ID, { nullable: true })
  id?: number;

  @Field()
  dappId: number;

  @Field()
  name: string = '';

  @Field(type => [MatcherDto])
  matchers: MatcherDto[];

  @Field(type => [VariableDto])
  variables: VariableDto[];
}
