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

import {
  AbiEntity,
  EventEntity,
  UserEntity
} from '../entities'
import { IsAddress } from '../decorators/IsAddress';
import { IsDefined } from "class-validator";

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

  @IsDefined()
  @Field()
  @Column({ type: 'text' })
  name: string = '';

  @Field(type => AbiEntity)
  @ManyToOne(type => AbiEntity, abi => abi.contracts)
  abi: AbiEntity;

  @Field()
  @Column({ type: 'boolean', default: true, nullable: false })
  isPublic: boolean;

  @Field()
  @RelationId((contract: ContractEntity) => contract.abi)
  abiId: number;

  @IsAddress({ message: 'Address must be a valid Ethereum address' })
  @Field()
  @Column({ type: 'text' })
  address: string = '';

  @IsDefined()
  @Field()
  @Column({ type: 'integer', default: 1, nullable: false })
  networkId: number;

  @OneToMany(type => EventEntity, event => event.contract)
  events: EventEntity[];

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
