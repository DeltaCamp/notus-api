import { Field, InputType, ID } from 'type-graphql';
import { MatcherType } from './MatcherType'

import { VariableDto } from '../variables/VariableDto'

@InputType()
export class MatcherDto {
  @Field(type => ID, { nullable: true })
  id: number;

  @Field(type => VariableDto)
  variable: VariableDto;

  @Field()
  type: MatcherType;

  @Field()
  operand: string = '';
}
