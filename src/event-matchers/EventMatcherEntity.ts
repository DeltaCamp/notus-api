import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne
} from 'typeorm';

import { EventEntity } from '../events/EventEntity'
import { MatcherEntity } from '../matchers/MatcherEntity'

@Entity({ name: 'event_matchers' })
export class EventMatcherEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => EventEntity, event => event.eventMatchers, {
    nullable: false
  })
  event: EventEntity;

  @ManyToOne(type => MatcherEntity, {
    nullable: false
  })
  matcher: MatcherEntity;
}
