import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';
import { User } from "../users/user.entity";

@Entity({ name: 'webhooks' })
export class Webhook {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(type => User, user => user.webhooks)
  // @JoinTable()
  users: User[];

  @Column({ length: 120 })
  name: string = '';

  @Column('text')
  data: string = '';

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
