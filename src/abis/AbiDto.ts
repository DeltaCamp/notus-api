import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class AbiDto {
  @Field(type => ID, { nullable: true })
  id?: number;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  isPublic: boolean;

  @Field({ nullable: true })
  abi: string;
}
