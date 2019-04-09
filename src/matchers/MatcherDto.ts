import { Field, InputType, ID } from 'type-graphql';
import { MatcherType } from './MatcherType'

@InputType()
export class MatcherDto {
  @Field(type => ID, { nullable: true })
  id: number;

  @Field()
  variableId: number;

  @Field()
  type: MatcherType;

  @Field()
  operand: string = '';
}
