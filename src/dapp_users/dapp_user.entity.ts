import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne
} from 'typeorm';
import { User } from "../users/user.entity";
import { Dapp } from "../dapps/dapp.entity";

@Entity({ name: 'dapp_users' })
export class DappUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => User, user => user.dapp_users)
  users: User[];

  @ManyToOne(type => Dapp, dapp => dapp.dapp_users)
  dapps: Dapp[];
  
  @Column()
  active: boolean = false;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
