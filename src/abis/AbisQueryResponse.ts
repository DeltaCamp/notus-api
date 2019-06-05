import { Field, ObjectType } from 'type-graphql'

import { PagedQueryResponse } from '../dtos/PagedQueryResponse'
import { AbiEntity } from './AbiEntity'

@ObjectType()
export class AbisQueryResponse extends PagedQueryResponse {
  @Field(type => [AbiEntity])
  abis: AbiEntity[];
}