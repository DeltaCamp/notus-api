import { Field, InputType, ID } from 'type-graphql';
import { Operator } from './Operator'
import { OperandDataType } from './OperandDataType'

@InputType()
export class MatcherDto {
  @Field(type => ID, { nullable: true })
  id: number;

  @Field()
  source: string;

  @Field()
  operator: Operator;

  @Field()
  operandDataType: OperandDataType;

  @Field()
  operand: string = '';
}
