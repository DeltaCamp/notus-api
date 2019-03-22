import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';
import { UserWebhookEntity } from "../user_webhooks/UserWebhookEntity";

@Entity({ name: 'webhooks' })
export class WebhookEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  // @OneToMany(type => UserWebhookEntity, user_webhook => user_webhook.webhook)
  // user_webhooks: UserWebhookEntity[];
/*
  @Column({ length: 120 })
  name: string = '';

  @Column('text')
  data: string = '';

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
  */
}
