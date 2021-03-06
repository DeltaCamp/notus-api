import { Field, InputType } from "type-graphql";

import { PagedQuery } from '../dtos/PagedQuery'

@InputType()
export class ContractsQuery extends PagedQuery {
  @Field({ nullable: true })
  ownerId?: number

  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  networkId?: number

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  hasAbiEvents?: boolean
}
