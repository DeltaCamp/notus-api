import { Field, InputType } from "type-graphql";

import { PagedQuery } from '../dtos/PagedQuery'

@InputType()
export class EventsQuery extends PagedQuery {
  @Field({ nullable: true })
  userId?: number

  @Field({ nullable: true })
  isPublic?: boolean

  @Field({ nullable: true })
  searchTerms: string;
}
