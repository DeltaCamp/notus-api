import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  RelationId
} from 'typeorm';
import { Field, Int, ObjectType, ID } from 'type-graphql';

import {
  EventEntity,
  MatcherEntity
} from '../entities'

@Entity({ name: 'event_matchers' })
@ObjectType()
export class EventMatcherEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(type => EventEntity)
  @ManyToOne(type => EventEntity, {
    nullable: false
  })
  event: EventEntity;

  @RelationId((eventMatcher: EventMatcherEntity) => eventMatcher.event)
  eventId: number;

  @Field(type => MatcherEntity)
  @ManyToOne(type => MatcherEntity, {
    nullable: false
  })
  matcher: MatcherEntity;

  @RelationId((eventMatcher: EventMatcherEntity) => eventMatcher.matcher)
  matcherId: number;
}
