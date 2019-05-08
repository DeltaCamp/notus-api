import { Field, ObjectType } from 'type-graphql'

import { PagedQueryResponse } from '../dtos/PagedQueryResponse'
import { AbiEventEntity } from './AbiEventEntity'

@ObjectType()
export class AbiEventsQueryResponse extends PagedQueryResponse {
  @Field(type => [AbiEventEntity])
  abiEvents: AbiEventEntity[];
}