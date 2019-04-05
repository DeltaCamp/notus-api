import { Field, InputType } from 'type-graphql';
import { MatcherType } from './MatcherType'

@InputType()
export class MatcherDto {
  @Field()
  variableId: number;

  @Field()
  type: MatcherType;

  @Field()
  operand: string = '';
}
