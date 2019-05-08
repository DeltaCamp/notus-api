import { Field, InputType } from "type-graphql";

import { PagedQuery } from '../dtos/PagedQuery'

@InputType()
export class AbiEventsQuery extends PagedQuery {
  @Field({ nullable: true })
  abiId?: number

  // @Field({ nullable: true })
  // isPublic?: boolean

  // @Field({ nullable: true })
  // name?: string
}
