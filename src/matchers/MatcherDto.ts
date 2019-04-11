import { Field, InputType, ID } from 'type-graphql';
import { Operator } from './Operator'
import { OperandDataType } from './OperandDataType'
import { VariableDto } from '../variables/VariableDto'

@InputType()
export class MatcherDto {
  @Field(type => ID, { nullable: true })
  id: number;

  @Field(type => VariableDto)
  variable: VariableDto;

  @Field()
  operator: Operator;

  @Field()
  operandDataType: OperandDataType;

  @Field()
  operand: string = '';
}
