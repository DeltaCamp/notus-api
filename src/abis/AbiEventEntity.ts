import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  RelationId,
  OneToMany
} from 'typeorm';
import { Field, ObjectType, ID } from 'type-graphql';
import { IsDefined } from 'class-validator';

import {
  AbiEntity,
  AbiEventInputEntity,
  EventEntity
} from '../entities';

@Entity({ name: 'abi_events' })
@ObjectType()
export class AbiEventEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @IsDefined()
  @Field()
  @Column({ type: 'text', nullable: false })
  title: string = '';

  @IsDefined()
  @Field()
  @Column({ type: 'text', nullable: false })
  name: string = '';

  @Field()
  @Column({ type: 'text', nullable: false })
  topic: string = '';

  @Field(type => [EventEntity])
  @OneToMany(type => EventEntity, event => event.abiEvent)
  events: EventEntity[];

  @Field()
  @ManyToOne(type => AbiEntity, abi => abi.abiEvents)
  abi: AbiEntity;

  @Field()
  @RelationId((abiEvent: AbiEventEntity) => abiEvent.abi)
  abiId: number;
  
  @Field(type => [AbiEventInputEntity])
  @OneToMany(type => AbiEventInputEntity, abiEventInput => abiEventInput.abiEvent)
  abiEventInputs: AbiEventInputEntity[];

  @Field()
  @Column({ type: 'boolean', default: true, nullable: false })
  isPublic: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  format(): string {
    return `${this.abi.name} ${this.name}`
  }
}
