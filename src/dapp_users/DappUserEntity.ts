import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne
} from 'typeorm';
import { UserEntity } from "../users/UserEntity";
import { DappEntity } from "../dapps/DappEntity";

@Entity({ name: 'dapp_users' })
export class DappUserEntity {
  @PrimaryGeneratedColumn()
  id!: number;
/*
  @ManyToOne(type => UserEntity, user => user.dapp_users)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(type => DappEntity, dapp => dapp.dapp_users)
  @JoinColumn({ name: 'dapp_id' })
  dapp: DappEntity;

  @Column()
  owner: boolean = false;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
  */
}
