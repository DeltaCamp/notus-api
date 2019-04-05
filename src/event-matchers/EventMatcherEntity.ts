import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne
} from 'typeorm';
import { Field, Int, ObjectType, ID } from 'type-graphql';

import { EventEntity } from '../events/EventEntity'
import { MatcherEntity } from '../matchers/MatcherEntity'

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

  @Field(type => MatcherEntity)
  @ManyToOne(type => MatcherEntity, {
    nullable: false
  })
  matcher: MatcherEntity;
}
