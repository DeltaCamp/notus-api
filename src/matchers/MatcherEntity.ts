import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  RelationId
} from 'typeorm';
import { Field, ObjectType, ID } from 'type-graphql';

import { OperandDataType } from './OperandDataType'
import { Operator } from './Operator'
import * as Source from './Source'
import { EventEntity } from '../entities';

@Entity({ name: 'matchers' })
@ObjectType()
export class MatcherEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id!: number;

  @ManyToOne(type => EventEntity, (event: EventEntity) => event.matchers, {
    nullable: false
  })
  @Field()
  event: EventEntity;

  @RelationId((matcher: MatcherEntity) => matcher.event)
  eventId: number;

  @Column({ type: 'integer', nullable: false, default: 1 })
  @Field()
  order: number;

  @Column({ type: 'enum', enum: Source, nullable: false })
  @Field()
  source: string;

  @Column({ type: 'enum', enum: Operator, nullable: false })
  @Field()
  operator: Operator;

  @Column({ type: 'text', nullable: true })
  @Field()
  operand: string;

  @Column({ type: 'enum', enum: OperandDataType, nullable: true })
  @Field()
  operandDataType: OperandDataType;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
