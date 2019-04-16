import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  RelationId
} from 'typeorm';
import { ethers } from 'ethers'
import { Interface } from 'ethers/utils';
import { Field, ObjectType, ID } from 'type-graphql';

import {
  ContractEventEntity,
  UserEntity
} from '../entities';

@ObjectType()
@Entity({ name: 'contracts' })
export class ContractEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ type: 'text' })
  name: string = '';

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  address: string = '';

  @Field()
  @Column({ type: 'text' })
  abi: string;

  @Field()
  @Column({ type: 'boolean' })
  isPublic: boolean;

  @Field(type => [ContractEventEntity])
  @OneToMany(type => ContractEventEntity, contractEvent => contractEvent.contract, {
    cascade: true
  })
  contractEvents: ContractEventEntity[];

  @ManyToOne(type => UserEntity, user => user.contracts)
  owner: UserEntity;

  @RelationId((contract: ContractEntity) => contract.owner)
  ownerId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  interface(): Interface {
    return new ethers.utils.Interface(this.abi)
  }
}
