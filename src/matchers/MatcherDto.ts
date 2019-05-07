import { Field, InputType, ID } from 'type-graphql';
import { Operator } from './Operator'

@InputType()
export class MatcherDto {
  @Field(type => ID, { nullable: true })
  id: number;

  @Field({ nullable: true })
  eventId: number;

  @Field({ nullable: true })
  abiEventInputId: number;

  @Field({ nullable: true })
  order: number;

  @Field({ nullable: true })
  source: string;

  @Field({ nullable: true })
  operator: Operator;

  @Field({ nullable: true })
  operand: string = '';
}
