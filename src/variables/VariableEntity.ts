import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  RelationId
} from 'typeorm';
import { IsIn } from 'class-validator'
import { Field, Int, ObjectType, ID } from 'type-graphql';

import { VariableType } from './VariableType'
import { SourceDataType } from './SourceDataType'
import { EventTypeEntity } from '../entities'

@Entity({ name: 'variables' })
@ObjectType()
export class VariableEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id!: number;

  @ManyToOne(type => EventTypeEntity, eventType => eventType.variables, {
    nullable: false
  })
  eventType: EventTypeEntity;

  @RelationId((variable: VariableEntity) => variable.eventType)
  eventTypeId: number;

  @Column({ type: 'enum', enum: VariableType, nullable: false })
  @Field()
  source: VariableType;

  @Column({ type: 'enum', enum: SourceDataType, nullable: false })
  @Field()
  sourceDataType: SourceDataType;

  @Column({ type: 'text', nullable: false })
  @Field()
  description: string = '';

  @Column({ type: 'boolean', nullable: false })
  @Field()
  isPublic: boolean = false;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
