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
import { WebhookEntity } from "../webhooks/WebhookEntity";

@Entity({ name: 'user_webhooks' })
export class UserWebhookEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => UserEntity, user => user.user_webhooks)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(type => WebhookEntity, webhook => webhook.user_webhooks)
  @JoinColumn({ name: 'webhook_id' })
  webhook: WebhookEntity;

  @Column()
  active: boolean = false;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
