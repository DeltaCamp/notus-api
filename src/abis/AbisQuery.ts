import { Field, InputType } from "type-graphql";

import { PagedQuery } from '../dtos/PagedQuery'

@InputType()
export class AbisQuery extends PagedQuery {
  @Field({ nullable: true })
  abiId?: number
}
