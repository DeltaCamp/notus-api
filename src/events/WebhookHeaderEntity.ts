import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  RelationId
} from 'typeorm';
import { Field, ObjectType, ID } from 'type-graphql';

import {
  EventEntity
} from '../entities'

@Entity({ name: 'webhook_headers' })
@ObjectType()
export class WebhookHeaderEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id!: number;

  @Field()
  @Column({ type: 'text', nullable: false })
  key: string;

  @Field()
  @Column({ type: 'text', nullable: false })
  value: string;

  @Field(type => EventEntity)
  @ManyToOne(type => EventEntity, event => event.webhookHeaders, {
    nullable: false
  })
  event: EventEntity;

  @RelationId((webhook: WebhookHeaderEntity) => webhook.event)
  eventId: number;
}
