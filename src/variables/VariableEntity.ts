import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne
} from 'typeorm';
import { IsIn } from 'class-validator'
import { Field, Int, ObjectType, ID } from 'type-graphql';

import { variables } from '../constants/variables'
import { solidityDataTypes } from '../constants/solidityDataTypes'
import { EventTypeEntity } from '../event-types/EventTypeEntity'

@Entity({ name: 'variables' })
@ObjectType()
export class VariableEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id!: number;

  @ManyToOne(type => EventTypeEntity, eventType => eventType.variables)
  eventType: EventTypeEntity

  @Column({ type: 'text', nullable: false })
  @Field()
  source: string = '';

  @Column({ type: 'text', nullable: false })
  @Field()
  @IsIn(solidityDataTypes)
  sourceDataType: string = '';

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
