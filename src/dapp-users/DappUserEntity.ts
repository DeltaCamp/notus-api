import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  RelationId
} from 'typeorm';
import { Field, Int, ObjectType, ID } from 'type-graphql';

import { UserEntity, DappEntity } from "../entities";

@ObjectType()
@Entity({ name: 'dapp_users' })
export class DappUserEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => UserEntity, user => user.dappUsers, {
    cascade: true,
    nullable: false
  })
  user: UserEntity;

  @Field()
  @RelationId((dappUser: DappUserEntity) => dappUser.user)
  userId: number;

  @Field()
  @ManyToOne(type => DappEntity, dapp => dapp.dappUsers, {
    nullable: false
  })
  dapp: DappEntity;

  @Field()
  @RelationId((dappUser: DappUserEntity) => dappUser.dapp)
  dappId: number;

  @Field()
  @Column()
  owner: boolean = false;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
