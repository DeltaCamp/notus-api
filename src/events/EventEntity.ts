import {
  Column,
  Entity,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  RelationId
} from 'typeorm';
import { Field, Int, ObjectType, ID } from 'type-graphql';

import {
  UserEntity,
  AppEntity,
  ContractEventEntity,
  MatcherEntity
} from '../entities'
import { EventScope } from './EventScope';

@Entity({ name: 'events' })
@ObjectType()
export class EventEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id!: number;

  @Field(type => UserEntity)
  @ManyToOne(type => UserEntity, user => user.events, {
    nullable: false
  })
  user: UserEntity;

  @RelationId((event: EventEntity) => event.user)
  userId: number;

  @Field()
  @Column({ type: 'enum', enum: EventScope, default: EventScope.EVENT })
  scope: EventScope = EventScope.EVENT;

  @Field(type => ContractEventEntity)
  @ManyToOne(type => ContractEventEntity)
  contractEvent?: ContractEventEntity | null;

  @RelationId((event: EventEntity) => event.contractEvent)
  contractEventId?: number;

  @Field(type => AppEntity, { nullable: true })
  @ManyToOne(type => AppEntity, app => app.events, {
    nullable: true
  })
  app: AppEntity;

  @RelationId((event: EventEntity) => event.app)
  appId: number;

  @Field()
  @Column({ type: 'text', nullable: false })
  title: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  isPublic: boolean;

  @Field(type => EventEntity, { nullable: true }) 
  @ManyToOne(type => EventEntity, event => event.children, {
    nullable: true
  })
  @JoinColumn({ name: 'parentId' })
  parent?: EventEntity | null;

  @Field({ nullable: true })
  @RelationId((event: EventEntity) => event.parent)
  parentId?: number | null;

  @OneToMany(type => EventEntity, child => child.parent, {
    nullable: true
  })
  children: EventEntity[];

  @Field(type => [MatcherEntity])
  @OneToMany(type => MatcherEntity, matcher => matcher.event)
  matchers: MatcherEntity[];

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
