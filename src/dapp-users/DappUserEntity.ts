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
    cascade: true
  })
  user: UserEntity;

  @ManyToOne(type => DappEntity, dapp => dapp.dappUsers)
  dapp: DappEntity;

  @Column()
  owner: boolean = false;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
