import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';
import { Field, Int, ObjectType, ID } from 'type-graphql';

import { DappUserEntity } from "../dapp-users/DappUserEntity";
import { EventTypeEntity } from '../event-types/EventTypeEntity';

@ObjectType()
@Entity({ name: 'dapps' })
export class DappEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(type => DappUserEntity, dappUser => dappUser.dapp, {
    cascade: true
  })
  dappUsers: DappUserEntity[];

  @OneToMany(type => EventTypeEntity, contract => contract.dapp)
  eventTypes: EventTypeEntity[];

  // @OneToMany(type => UserEntity, user => user.dapp)
  // owner: DappUserEntity.find({ owner: true });

  @Field()
  @Column({ length: 120 })
  name: string = '';

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
