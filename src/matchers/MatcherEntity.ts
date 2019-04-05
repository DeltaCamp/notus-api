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
import { Field, Int, ObjectType, ID } from 'type-graphql';

import { MatcherType } from './MatcherType'
import { VariableEntity } from '../variables'
import { EventMatcherEntity } from '../event-matchers'
import { EventTypeMatcherEntity } from '../event-type-matchers'

@Entity({ name: 'matchers' })
@ObjectType()
export class MatcherEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id!: number;

  @Field(type => VariableEntity)
  @ManyToOne(type => VariableEntity, {
    nullable: false
  })
  variable: VariableEntity;

  // @Field()
  // @OneToMany(type => EventMatcherEntity, eventMatcher => eventMatcher.matcher)
  // eventMatchers: EventMatcherEntity[];

  // @Field()
  // @OneToMany(type => EventTypeMatcherEntity, eventTypeMatcher => eventTypeMatcher.matcher)
  // eventTypeMatchers: EventTypeMatcherEntity[];

  @Column({ type: 'enum', enum: MatcherType, nullable: false })
  @Field()
  type: MatcherType;

  @Column({ type: 'text', nullable: false })
  @Field()
  operand: string;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
