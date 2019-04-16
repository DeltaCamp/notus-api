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

import { ContractEntity, ContractEventInputEntity } from '../entities';

@ObjectType()
@Entity({ name: 'contract_events' })
export class ContractEventEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ type: 'text', nullable: false })
  name: string = '';

  @Field()
  @Column({ type: 'text', nullable: false })
  topic: string = '';

  @Field()
  @ManyToOne(type => ContractEntity, contract => contract.contractEvents)
  contract: ContractEntity;

  @Field()
  @RelationId((contractEvent: ContractEventEntity) => contractEvent.contract)
  contractId: number;
  
  @Field(type => [ContractEventInputEntity])
  @OneToMany(type => ContractEventInputEntity, contractEventInput => contractEventInput.contractEvent, {
    cascade: true
  })
  contractEventInputs: ContractEventInputEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
