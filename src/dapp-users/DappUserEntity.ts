import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne
} from 'typeorm';

import { UserEntity } from "../users/UserEntity";
import { DappEntity } from "../dapps/DappEntity";

@Entity({ name: 'dapp_users' })
export class DappUserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => UserEntity, user => user.dappUsers, {
    cascade: true,
    nullable: false
  })
  user: UserEntity;

  @ManyToOne(type => DappEntity, dapp => dapp.dappUsers, {
    nullable: false
  })
  dapp: DappEntity;

  @Column()
  owner: boolean = false;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
