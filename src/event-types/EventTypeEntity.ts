import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { Field, Int, ObjectType, ID } from 'type-graphql';

import { VariableEntity } from '../variables/VariableEntity';
import { EventTypeMatcherEntity } from '../event-type-matchers/EventTypeMatcherEntity';
import { DappEntity } from "../dapps/DappEntity";
import { EventEntity } from '../events/EventEntity';

@ObjectType()
@Entity({ name: 'event_types' })
export class EventTypeEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(type => DappEntity)
  @ManyToOne(type => DappEntity, dapp => dapp.eventTypes, {
    nullable: false
  })
  dapp: DappEntity;

  @Field()
  @Column({ type: 'text' })
  name: string = '';

  @OneToMany(type => EventTypeMatcherEntity, eventTypeMatcher => eventTypeMatcher.eventType)
  eventTypeMatchers: EventTypeMatcherEntity[];

  @OneToMany(type => EventEntity, event => event.eventType)
  events: EventEntity[];

  @Field(type => [VariableEntity])
  @OneToMany(type => VariableEntity, variable => variable.eventType)
  variables: VariableEntity[];

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
