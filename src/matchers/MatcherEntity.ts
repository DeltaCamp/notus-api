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
import { IsNotEmpty, ValidateIf } from "class-validator";

import { OperatorTitle } from './OperatorTitle'
import { Operator } from './Operator'
import * as Source from './Source'
import { SourceTitle } from './SourceTitle'
import {
  EventEntity,
  AbiEventInputEntity
} from '../entities';

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

  @Field(type => AbiEventInputEntity)
  @ManyToOne(type => AbiEventInputEntity, { nullable: true })
  abiEventInput: AbiEventInputEntity;

  @Field({ nullable: true })
  @RelationId((matcher: MatcherEntity) => matcher.abiEventInput)
  abiEventInputId: number;

  @Column({ type: 'enum', enum: Operator, nullable: false })
  @Field()
  operator: Operator;

  @ValidateIf(matcher => matcher.operator !== Operator.NOOP)
  @IsNotEmpty()
  @Column({ type: 'text', nullable: true })
  @Field()
  operand: string;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  description(): string {
    return `${this.formatSource()} is ${OperatorTitle[this.operator]} ${this.operand}`
  }

  formatSource(): string {
    if (this.source === Source.CONTRACT_EVENT_INPUT) {
      return this.abiEventInput.description()
    } else {
      return SourceTitle[this.source]
    }
  }
}
