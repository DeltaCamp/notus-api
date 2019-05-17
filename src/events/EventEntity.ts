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
import { Field, ObjectType, ID } from 'type-graphql';
import { MinLength, IsJSON, IsOptional, IsUrl, IsHexColor } from 'class-validator'

import {
  UserEntity,
  AppEntity,
  AbiEventEntity,
  EventLogEntity,
  MatcherEntity,
  ContractEntity,
  WebhookHeaderEntity
} from '../entities'
import { EventScope } from './EventScope';
import { EventScopeTitle } from './EventScopeTitle'

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
  @Column({ type: 'enum', enum: EventScope, default: EventScope.TRANSACTION })
  scope: EventScope = EventScope.TRANSACTION;

  @Field(type => AbiEventEntity, {
    nullable: true
  })
  @ManyToOne(type => AbiEventEntity)
  abiEvent?: AbiEventEntity | null;

  @Field({
    nullable: true
  })
  @RelationId((event: EventEntity) => event.abiEvent)
  abiEventId?: number;

  @Field(type => AppEntity, { nullable: true })
  @ManyToOne(type => AppEntity, app => app.events, {
    nullable: true
  })
  app: AppEntity;

  @RelationId((event: EventEntity) => event.app)
  appId: number;

  @Field(type => ContractEntity, { nullable: true })
  @ManyToOne(type => ContractEntity, contract => contract.events)
  contract: ContractEntity

  @Field({ nullable: true })
  @RelationId((event: EventEntity) => event.contract)
  contractId: number;

  @MinLength(8, {
    message: "Title must be longer than $constraint1 characters"
  })
  @Field()
  @Column({ type: 'text', nullable: false })
  title: string;

  @Field()
  @Column({ type: 'boolean', default: false, nullable: false })
  isPublic: boolean;

  @Field()
  @Column({ type: 'boolean', default: true, nullable: false })
  isActive: boolean;

  @Field(type => EventEntity, { nullable: true }) 
  @ManyToOne(type => EventEntity, event => event.children, {
    nullable: true
  })
  @JoinColumn({ name: 'parentId' })
  parent?: EventEntity | null;

  @Field({ nullable: true })
  @RelationId((event: EventEntity) => event.parent)
  parentId?: number | null;

  @OneToMany(type => EventLogEntity, eventLog => eventLog.event)
  eventLogs: EventLogEntity[];

  @OneToMany(type => EventEntity, child => child.parent, {
    nullable: true
  })
  children: EventEntity[];

  @Field(type => [MatcherEntity])
  @OneToMany(type => MatcherEntity, matcher => matcher.event)
  matchers: MatcherEntity[];

  @Field()
  @Column({ type: 'int', default: -1, nullable: false })
  runCount: number;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Field({ nullable: true })
  @Column({ type: 'timestamp', default: null, nullable: true })
  deletedAt?: Date;

  @IsOptional()
  @IsUrl()
  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  webhookUrl: string;

  @IsOptional()
  @IsJSON()
  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  webhookBody: string;

  @Field(type => [WebhookHeaderEntity], { nullable: true })
  @OneToMany(type => WebhookHeaderEntity, webhookHeader => webhookHeader.event)
  webhookHeaders: WebhookHeaderEntity[];

  @IsOptional()
  @IsHexColor()
  @Field()
  @Column({ type: 'text', default: '#2a083f' })
  color: string;

  @Field()
  @Column({ type: 'boolean', default: true, nullable: false })
  sendEmail: boolean;

  @Column({ type: 'text', nullable: false })
  disableEmailKey: string;

  hasEmailAction(): boolean {
    return this.sendEmail
  }

  formatTitle(): string {
    let title: string

    if (this.title) {
      title = this.title
    } else if (this.parent) {
      title = this.parent.formatTitle()
    } else if (this.scope === EventScope.CONTRACT_EVENT) {
      title = this.abiEvent.format()
    } else {
      title = EventScopeTitle[this.scope]
    }

    return title
  }
}
