import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne
} from 'typeorm';
import { User } from "../users/user.entity";
import { Dapp } from "../dapps/dapp.entity";

@Entity({ name: 'dapp_users' })
export class DappUserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => User, user => user.dapp_users)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(type => Dapp, dapp => dapp.dapp_users)
  @JoinColumn({ name: 'dapp_id' })
  dapp: Dapp;

  @Column()
  owner: boolean = false;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
