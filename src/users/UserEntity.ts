import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';
import { DappUserEntity } from "../dapp_users/DappUserEntity";
import { UserWebhookEntity } from "../user_webhooks/UserWebhookEntity";

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(type => DappUserEntity, dapp_user => dapp_user.user, {
    cascade: true
  })
  dapp_users: DappUserEntity[];

  @OneToMany(type => UserWebhookEntity, user_webhook => user_webhook.user, {
    cascade: true
  })
  user_webhooks: UserWebhookEntity[];

  @Column({ length: 120 })
  name: string = '';

  @Column({ length: 320 })
  email: string = '';

  @Column()
  confirmed: boolean = false;

  @Column()
  confirmation_code: string = '';

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
