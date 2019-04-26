import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class PagedQueryResponse {
  @Field()
  totalCount: number;

  @Field({ nullable: true })
  skip: number;

  @Field({ nullable: true })
  take: number;
}