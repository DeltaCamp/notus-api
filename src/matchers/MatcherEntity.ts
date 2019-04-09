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

import { MatcherType } from './MatcherType'
import {
  VariableEntity
} from '../entities'

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

  @RelationId((matcher: MatcherEntity) => matcher.variable)
  variableId: number;

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
