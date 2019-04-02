import { Field, InputType, ID } from 'type-graphql';

@InputType()
export class VariableDto {
  @Field(type => ID, { nullable: true })
  id?: number;

  @Field()
  source: string;

  @Field()
  sourceDataType: string = '';

  @Field()
  description: string = '';

  @Field()
  isPublic: boolean = false;
}
