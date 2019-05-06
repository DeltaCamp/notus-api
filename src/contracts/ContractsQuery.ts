import { Field, InputType } from "type-graphql";

import { PagedQuery } from '../dtos/PagedQuery'

@InputType()
export class ContractsQuery extends PagedQuery {
  @Field({ nullable: true })
  userId?: number

  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  name?: string
}
