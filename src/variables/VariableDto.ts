import { Field, InputType, ID } from 'type-graphql';
import { VariableType } from './VariableType'
import { SourceDataType } from './SourceDataType'

@InputType()
export class VariableDto {
  @Field(type => ID, { nullable: true })
  id?: number;

  @Field()
  source: VariableType;

  @Field()
  sourceDataType: SourceDataType;

  @Field()
  description: string = '';

  @Field()
  isPublic: boolean = false;

  @Field({ nullable: true })
  eventTypeId?: number
}
