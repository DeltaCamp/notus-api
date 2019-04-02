import { Field, InputType } from 'type-graphql';

@InputType()
export class MatcherDto {
  @Field()
  variableId: number;

  @Field()
  type: string = '';

  @Field()
  operand: string = '';
}
