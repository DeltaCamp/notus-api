import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne
} from 'typeorm';
import { Field, Int, ObjectType, ID } from 'type-graphql';

import { EventTypeEntity } from '../event-types/EventTypeEntity'
import { MatcherEntity } from '../matchers/MatcherEntity'

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

  @Field(type => MatcherEntity)
  @ManyToOne(type => MatcherEntity, {
    nullable: false
  })
  matcher: MatcherEntity;
}
