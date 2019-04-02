import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne
} from 'typeorm';

import { EventTypeEntity } from '../event-types/EventTypeEntity'
import { MatcherEntity } from '../matchers/MatcherEntity'

@Entity({ name: 'event_type_matchers' })
export class EventTypeMatcherEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => EventTypeEntity)
  eventType: EventTypeEntity;

  @ManyToOne(type => MatcherEntity)
  matcher: MatcherEntity;
}
