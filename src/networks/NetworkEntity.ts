import { Field, ObjectType, ID } from 'type-graphql';

@ObjectType()
export class NetworkEntity {
  @Field(type => ID)
  id: number;

  @Field()
  name: string;
}
