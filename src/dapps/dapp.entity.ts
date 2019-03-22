import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';
import { DappUser } from "../dapp_users/dapp_user.entity";

@Entity({ name: 'dapps' })
export class Dapp {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(type => DappUser, dapp_user => dapp_user.dapps)
  // @JoinTable()
  dapp_users: DappUser[];

  @Column({ length: 120 })
  name: string = '';

  @Column()
  api_key: string = '';

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
