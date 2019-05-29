import { Field, InputType } from "type-graphql";

import { PagedQuery } from '../dtos/PagedQuery'
import { Network } from '../networks/Network'

@InputType()
export class ContractsQuery extends PagedQuery {
  @Field({ nullable: true })
  ownerId?: number

  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  networkId?: Network

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  hasAbiEvents?: boolean
}
