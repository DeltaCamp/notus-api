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
import { MinLength } from 'class-validator';
import { ethers } from 'ethers';
import { Interface } from 'ethers/utils';
import { Field, ObjectType, ID } from 'type-graphql';

import {
  AbiEventEntity,
  UserEntity
} from '../entities';

@ObjectType()
@Entity({ name: 'abis' })
export class AbiEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @MinLength(3, {
    message: "Name is too short"
  })
  @Field()
  @Column({ type: 'text' })
  name: string = '';

  @Field()
  @Column({ type: 'text' })
  abi: string;

  @Field()
  @Column({ type: 'boolean' })
  isPublic: boolean;

  @Field(type => [AbiEventEntity])
  @OneToMany(type => AbiEventEntity, abiEvent => abiEvent.abi, {
    cascade: true
  })
  abiEvents: AbiEventEntity[];

  @ManyToOne(type => UserEntity, user => user.abis)
  owner: UserEntity;

  @RelationId((abi: AbiEntity) => abi.owner)
  ownerId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  interface(): Interface {
    return new ethers.utils.Interface(this.abi)
  }
}
