import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';
import { Field, ObjectType, ID } from 'type-graphql';

import {
  AppEntity,
  EventEntity,
  ContractEntity,
  AbiEntity
} from '../entities'

import { keyHashHex } from '../utils/keyHashHex'
import { newKeyHex } from '../utils/newKeyHex'
import { newKeyExpiryDate } from '../utils/newKeyExpiryDate'
import { IsEmail } from 'class-validator';

@Entity({ name: 'users' })
@ObjectType()
export class UserEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id!: number;

  @OneToMany(type => AppEntity, app => app.owner)
  apps: AppEntity[];

  @OneToMany(type => EventEntity, event => event.user)
  events: EventEntity[];

  @OneToMany(type => AbiEntity, abi => abi.owner)
  abis: AbiEntity[];

  @OneToMany(type => ContractEntity, contract => contract.owner)
  contracts: ContractEntity[];

  @Field()
  @Column({ type: 'text' })
  name: string = '';

  @IsEmail()
  @Field()
  @Column({ type: 'text' })
  email: string = '';

  @Column()
  confirmed: boolean = false;

  @Column({ type: 'text', nullable: true })
  one_time_key_hash: string;

  @Column({ type: 'timestamptz', nullable: true })
  one_time_key_expires_at: Date;

  @Column ({ type: 'text', nullable: true })
  password_hash: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Field()
  @Column({ type: 'text', nullable: true })
  etherscan_api_key: string;

  @Field()
  @Column({ type: 'boolean', default: false, nullable: false })
  isAdmin: boolean;

  public clearOneTimeKey(): void {
    this.confirmed = true
    this.one_time_key_hash = null
    this.one_time_key_expires_at = null
  }

  public generateOneTimeKey(): string {
    const oneTimeKey = newKeyHex()
    this.one_time_key_hash = keyHashHex(oneTimeKey)
    this.one_time_key_expires_at = newKeyExpiryDate()

    return oneTimeKey
  }
}
