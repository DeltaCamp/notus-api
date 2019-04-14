import {
  Column,
  Entity,
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
  MatcherEntity
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

  @RelationId((event: EventEntity) => event.user)
  userId: number;

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
  parent: EventEntity;

  // sometimes we have this for relations but sometimes we don't?
  // @Field({ nullable: true })
  // @RelationId((event: EventEntity) => event.parent)
  // parentId: number;

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
