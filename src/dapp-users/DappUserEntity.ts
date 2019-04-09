import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  RelationId
} from 'typeorm';

import { UserEntity, DappEntity } from "../entities";

@Entity({ name: 'dapp_users' })
export class DappUserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => UserEntity, user => user.dappUsers, {
    cascade: true,
    nullable: false
  })
  user: UserEntity;

  @RelationId((dappUser: DappUserEntity) => dappUser.user)
  userId: number;

  @ManyToOne(type => DappEntity, dapp => dapp.dappUsers, {
    nullable: false
  })
  dapp: DappEntity;

  @RelationId((dappUser: DappUserEntity) => dappUser.dapp)
  dappId: number;

  @Column()
  owner: boolean = false;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
