import { Field, InputType } from 'type-graphql';

@InputType()
export class PagedQuery {
  @Field({ nullable: true })
  skip: number;

  @Field({ nullable: true })
  take: number;
}