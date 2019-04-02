import { Field, InputType, ID } from 'type-graphql';

@InputType()
export class DappDto {
  @Field(type => ID, { nullable: true })
  id?: number;

  @Field()
  name: string = '';
}
