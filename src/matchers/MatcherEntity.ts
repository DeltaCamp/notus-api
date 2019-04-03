import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { IsIn } from 'class-validator'
import { Field, Int, ObjectType, ID } from 'type-graphql';

import { VariableEntity } from '../variables/VariableEntity'

@Entity({ name: 'matchers' })
@ObjectType()
export class MatcherEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id!: number;

  @ManyToOne(type => VariableEntity, {
    nullable: false
  })
  variable: VariableEntity;

  @Column({ type: 'text', nullable: false })
  @Field()
  @IsIn(['eq', 'gte', 'lt', 'gt', 'lte'])
  type: string = '';

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
