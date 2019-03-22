import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';
import { UserWebhook } from "../user_webhooks/user_webhook.entity";

@Entity({ name: 'webhooks' })
export class Webhook {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(type => UserWebhook, user_webhook => user_webhook.users)
  // @JoinTable()
  user_webhooks: UserWebhook[];

  @Column({ length: 120 })
  name: string = '';

  @Column('text')
  data: string = '';

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
