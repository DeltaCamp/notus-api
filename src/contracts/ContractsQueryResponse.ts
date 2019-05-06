import { Field, ObjectType } from 'type-graphql'

import { PagedQueryResponse } from '../dtos/PagedQueryResponse'
import { ContractEntity } from '../entities'

@ObjectType()
export class ContractsQueryResponse extends PagedQueryResponse {
  @Field(type => [ContractEntity])
  contracts: ContractEntity[];
}