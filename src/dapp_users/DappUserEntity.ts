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

  @Column({ type: 'varchar', nullable: true })
  access_key: string;

  @Column({ type: 'timestamptz', nullable: true })
  access_key_expires_at: Date;

  @Column({ type: 'varchar', nullable: true })
  request_key: string;

  @Column({ type: 'timestamptz', nullable: true })
  request_key_expires_at: Date;

  @Column({ type: 'bool' })
  confirmed: boolean = false;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  generateAccessKey(request_key) {
    if (!this.request_key || this.request_key !== keyHashHex(request_key)) {
      throw new Error(`Invalid request key`)
    }
    this.request_key_expires_at = new Date()
    const access_key = newKeyHex()
    this.access_key = keyHashHex(access_key)
    this.access_key_expires_at = newKeyExpiryDate()

    return access_key
  }

  generateRequestKey() {
    const requestKey = newKeyHex()
    this.request_key = keyHashHex(requestKey)
    this.request_key_expires_at = newKeyExpiryDate()

    return requestKey
  }
}
