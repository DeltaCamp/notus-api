import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class AbiEventDto {
  @Field(type => ID, { nullable: true })
  id?: number;

  @Field({ nullable: true })
  isPublic?: boolean;
}
