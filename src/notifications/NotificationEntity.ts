import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { DappUserEntity } from '../dapp_users/DappUserEntity'

@Entity({ name: 'notifications' })
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  name: string = '';

  @ManyToOne(type => DappUserEntity, dapp_user => dapp_user.notifications)
  @JoinColumn({ name: 'dapp_user_id' })
  dapp_user: DappUserEntity;

  @Column({ length: 64 })
  address: string

  @Column({ type: 'text', array: true })
  topics: string[];

  @Column({ type: 'text' })
  subject: string;

  @Column({ type: 'text' })
  body: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
