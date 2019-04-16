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
import { ContractEventEntity } from './ContractEventEntity'

@ObjectType()
@Entity({ name: 'contract_event_inputs' })
export class ContractEventInputEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ type: 'text', nullable: false })
  name: string = '';

  @Field()
  @Column({ type: 'enum', enum: SolidityDataType, nullable: false })
  type: SolidityDataType;

  @Field(type => ContractEventEntity)
  @ManyToOne(type => ContractEventEntity, contractEvent => contractEvent.contractEventInputs)
  contractEvent: ContractEventEntity;

  @Field()
  @RelationId((contractEventInput: ContractEventInputEntity) => contractEventInput.contractEvent)
  contractEventId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
