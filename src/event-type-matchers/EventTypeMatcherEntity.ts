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

  @ManyToOne(type => EventTypeEntity, {
    nullable: true
  })
  eventType: EventTypeEntity;

  @ManyToOne(type => MatcherEntity, {
    nullable: true
  })
  matcher: MatcherEntity;
}
