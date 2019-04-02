import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { IsIn } from 'class-validator'
import { Field, Int, ObjectType, ID } from 'type-graphql';

import { UserEntity } from '../users/UserEntity'
import { EventTypeEntity } from '../event-types/EventTypeEntity'
import { EventMatcherEntity } from '../event-matchers/EventMatcherEntity'

@Entity({ name: 'events' })
@ObjectType()
export class EventEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id!: number;

  @Column({ type: 'text' })
  @Field()
  name: string = '';

  @ManyToOne(type => UserEntity, user => user.events)
  user: UserEntity;

  @ManyToOne(type => EventTypeEntity, eventType => eventType.events)
  eventType: EventTypeEntity;

  @OneToMany(type => EventMatcherEntity, eventMatcher => eventMatcher.event)
  eventMatchers: EventMatcherEntity[];

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
