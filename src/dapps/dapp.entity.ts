import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToMany
} from 'typeorm';
import { User } from "../users/user.entity";

@Entity({ name: 'dapps' })
export class Dapp {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToMany(type => User, user => user.dapps)
  // @JoinTable()
  users: User[];

  @Column({ length: 120 })
  name: string = '';

  @Column()
  api_key: string = '';

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
