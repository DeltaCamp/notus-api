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
import { addHours } from 'date-fns';
import * as crypto from 'crypto';

import { UserEntity } from "../users/UserEntity";
import { DappEntity } from "../dapps/DappEntity";
import { NotificationEntity } from '../notifications/NotificationEntity';
import { sha256 } from '../utils/sha256'
import { newKeyHex } from '../utils/newKeyHex'

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

  @Column({ type: 'varchar' })
  access_key: string;

  @Column({ type: 'timestamptz' })
  access_key_expires_at: Date;

  @Column({ type: 'varchar' })
  request_key: string;

  @Column({ type: 'timestamptz' })
  request_key_expires_at: Date;

  @Column({ type: 'bool' })
  confirmed: boolean = false;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  generateAccessKey(request_key) {
    if (!this.request_key || this.request_key !== sha256(request_key).toString('hex')) {
      throw new Error(`Invalid request key`)
    }
    this.request_key_expires_at = new Date()
    const access_key = newKeyHex()
    this.access_key = sha256(access_key).toString('hex')
    this.access_key_expires_at = addHours(new Date(), 24)

    return access_key
  }

  generateRequestKey() {
    const requestKey = newKeyHex()
    this.request_key = sha256(requestKey).toString('hex')
    this.request_key_expires_at = addHours(new Date(), 24);

    return requestKey
  }
}
