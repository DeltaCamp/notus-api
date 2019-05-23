import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class OneTimeKeyValidEntity {
  @Field()
  valid: boolean;

  @Field({ nullable: true })
  expiresAt?: Date;
}
