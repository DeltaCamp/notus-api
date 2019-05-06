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

import {
  AbiEntity,
  UserEntity
} from '../entities'

import { IsAddress } from '../decorators/IsAddress';

@Entity({ name: 'contracts' })
@ObjectType()
export class ContractEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id!: number;

  @Field(type => UserEntity)
  @ManyToOne(type => UserEntity, user => user.contracts)
  owner: UserEntity;

  @Field()
  @RelationId((contract: ContractEntity) => contract.owner)
  ownerId: number;

  @Field()
  @Column({ type: 'text' })
  name: string = '';

  @Field(type => AbiEntity)
  @ManyToOne(type => AbiEntity, abi => abi.contracts)
  abi: AbiEntity;

  @Field()
  @RelationId((contract: ContractEntity) => contract.abi)
  abiId: number;

  @IsAddress({ message: 'Address must be a valid Ethereum address' })
  @Field()
  @Column({ type: 'text' })
  address: string = '';

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Field({ nullable: true })
  @Column({ type: 'timestamp', default: null, nullable: true })
  deletedAt?: Date;
}
