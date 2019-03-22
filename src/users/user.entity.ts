import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';
import { DappUser } from "../dapp_users/dapp_user.entity";
import { UserWebhook } from "../user_webhooks/user_webhook.entity";

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(type => DappUser, dapp_user => dapp_user.users)
  dapp_users: DappUser[];

  @OneToMany(type => UserWebhook, user_webhook => user_webhook.users)
  user_webhooks: UserWebhook[];
  
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
