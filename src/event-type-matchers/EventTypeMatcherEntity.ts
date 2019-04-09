import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  RelationId
} from 'typeorm';
import { Field, Int, ObjectType, ID } from 'type-graphql';

import {
  MatcherEntity,
  EventTypeEntity
} from '../entities'

@ObjectType()
@Entity({ name: 'event_type_matchers' })
export class EventTypeMatcherEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(type => EventTypeEntity)
  @ManyToOne(type => EventTypeEntity, {
    nullable: false
  })
  eventType: EventTypeEntity;

  @RelationId((eventTypeMatcher: EventTypeMatcherEntity) => eventTypeMatcher.eventType)
  eventTypeId: number;

  @Field(type => MatcherEntity)
  @ManyToOne(type => MatcherEntity, {
    nullable: false
  })
  matcher: MatcherEntity;

  @RelationId((eventTypeMatcher: EventTypeMatcherEntity) => eventTypeMatcher.matcher)
  matcherId: number;
}
