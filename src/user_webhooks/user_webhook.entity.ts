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
import { Webhook } from "../webhooks/webhook.entity";

@Entity({ name: 'user_webhooks' })
export class UserWebhook {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => User, user => user.user_webhooks)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(type => Webhook, webhook => webhook.user_webhooks)
  @JoinColumn({ name: 'webhook_id' })
  webhook: Webhook;
  
  @Column()
  active: boolean = false;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
