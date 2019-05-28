import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class UserDto {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  etherscan_api_key?: string;
}
