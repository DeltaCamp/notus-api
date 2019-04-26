import { Field, ObjectType } from 'type-graphql'

import { PagedQueryResponse } from '../dtos/PagedQueryResponse'
import { EventEntity } from '../entities'

@ObjectType()
export class EventsQueryResponse extends PagedQueryResponse {
  @Field(type => [EventEntity])
  events: EventEntity[];
}