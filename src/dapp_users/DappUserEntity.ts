import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import * as crypto from 'crypto';

import { UserEntity } from "../users/UserEntity";
import { DappEntity } from "../dapps/DappEntity";
import { NotificationEntity } from '../notifications/NotificationEntity';
import { keyHashHex } from '../utils/keyHashHex'
import { newKeyHex } from '../utils/newKeyHex'
import { newKeyExpiryDate } from '../utils/newKeyExpiryDate'

@Entity({ name: 'dapp_users' })
export class DappUserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => UserEntity, user => user.dapp_users, {
    cascade: true
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(type => DappEntity, dapp => dapp.dapp_users)
  @JoinColumn({ name: 'dapp_id' })
  dapp: DappEntity;

  @OneToMany(type => NotificationEntity, notification => notification.dapp_user)
  notifications: NotificationEntity[];

  @Column()
  owner: boolean = false;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
