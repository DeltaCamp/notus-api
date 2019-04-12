import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  RelationId
} from 'typeorm';
import { Field, Int, ObjectType, ID } from 'type-graphql';

import {
  EventTypeMatcherEntity,
  DappEntity,
  EventEntity
} from '../entities';

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

  @RelationId((eventType: EventTypeEntity) => eventType.dapp)
  dappId: number;

  @Field()
  @Column({ type: 'text', nullable: false })
  name: string = '';

  // Fixed default variables: ie. a contractAddress at 0x1234 that gets set for every event
  @Field(type => [EventTypeMatcherEntity])
  @OneToMany(type => EventTypeMatcherEntity, eventTypeMatcher => eventTypeMatcher.eventType)
  eventTypeMatchers: EventTypeMatcherEntity[];

  @OneToMany(type => EventEntity, event => event.eventType)
  events: EventEntity[];

  @Field(type => Date)
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field(type => Date)
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
