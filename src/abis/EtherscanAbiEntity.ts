import { Field, ObjectType, ID } from 'type-graphql';

@ObjectType()
export class EtherscanAbiEntity {
  @Field()
  status: string;

  @Field()
  message: string;

  @Field()
  result: string;
}
