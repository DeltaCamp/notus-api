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

import { SolidityDataType } from '../common/SolidityDataType';
import { AbiEventEntity } from './AbiEventEntity'
import { MetaDataType } from '../matchers/MetaDataType';

@ObjectType()
@Entity({ name: 'abi_event_inputs' })
export class AbiEventInputEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ type: 'text', nullable: false })
  name: string = '';

  @Field()
  @Column({ type: 'enum', enum: SolidityDataType, nullable: false })
  type: SolidityDataType;

  @Field({ nullable: true })
  @Column({ type: 'enum', enum: MetaDataType, nullable: true })
  metaType: MetaDataType;

  @Field(type => AbiEventEntity)
  @ManyToOne(type => AbiEventEntity, abiEvent => abiEvent.abiEventInputs)
  abiEvent: AbiEventEntity;

  @Field()
  @RelationId((abiEventInput: AbiEventInputEntity) => abiEventInput.abiEvent)
  abiEventId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  description(): string {
    return `${this.abiEvent.name} ${this.name}`
  }
}
