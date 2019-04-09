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

import {
  UserEntity,
  EventTypeEntity,
  EventMatcherEntity
} from '../entities'

@Entity({ name: 'events' })
@ObjectType()
export class EventEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id!: number;

  @ManyToOne(type => UserEntity, user => user.events, {
    nullable: false
  })
  user: UserEntity;

  @Field(type => EventTypeEntity)
  @ManyToOne(type => EventTypeEntity, eventType => eventType.events, {
    nullable: false
  })
  eventType: EventTypeEntity;

  @Field(type => [EventMatcherEntity])
  @OneToMany(type => EventMatcherEntity, eventMatcher => eventMatcher.event)
  eventMatchers: EventMatcherEntity[];

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
