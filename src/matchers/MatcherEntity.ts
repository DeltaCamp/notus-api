import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  RelationId
} from 'typeorm';
import { Field, Int, ObjectType, ID } from 'type-graphql';

import { OperandDataType } from './OperandDataType'
import { Operator } from './Operator'
import * as Source from './Source'

@Entity({ name: 'matchers' })
@ObjectType()
export class MatcherEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id!: number;

  @Column({ type: 'enum', enum: Source, nullable: false })
  @Field()
  source: string;

  @Column({ type: 'enum', enum: Operator, nullable: false })
  @Field()
  operator: Operator;

  @Column({ type: 'text', nullable: false })
  @Field()
  operand: string;

  @Column({ type: 'enum', enum: OperandDataType, nullable: false })
  @Field()
  operandDataType: OperandDataType;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
