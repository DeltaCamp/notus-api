import { Field, InputType, ID } from 'type-graphql';
import { Operator } from './Operator'
import { OperandDataType } from './OperandDataType'

@InputType()
export class MatcherDto {
  @Field(type => ID, { nullable: true })
  id: number;

  @Field({ nullable: true })
  eventId: number;

  @Field({ nullable: true })
  order: number;

  @Field()
  source: string;

  @Field()
  operator: Operator;

  @Field({ nullable: true })
  operandDataType: OperandDataType;

  @Field({ nullable: true })
  operand: string = '';
}
