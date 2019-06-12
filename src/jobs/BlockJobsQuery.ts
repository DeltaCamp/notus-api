import { Field, InputType } from "type-graphql";

import { PagedQuery } from '../dtos/PagedQuery'

@InputType()
export class BlockJobsQuery extends PagedQuery {
  @Field({ nullable: true })
  chainId?: number;

  @Field({ nullable: true })
  state?: string
}
