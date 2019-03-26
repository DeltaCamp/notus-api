import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne
} from 'typeorm';
import { addHours } from 'date-fns';
import * as crypto from 'crypto';

import { UserEntity } from "../users/UserEntity";
import { DappEntity } from "../dapps/DappEntity";
import { sha256 } from '../utils/sha256'
import { newKeyAscii } from '../utils/newKeyAscii'

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
    if (!this.request_key || this.request_key !== sha256(request_key).toString('ascii')) {
      throw new Error(`Invalid request key`)
    }
    this.request_key_expires_at = new Date()
    const access_key = newKeyAscii()
    this.access_key = sha256(access_key).toString('ascii')
    this.access_key_expires_at = addHours(new Date(), 24)

    return access_key
  }

  generateRequestKey() {
    const requestKey = newKeyAscii()
    this.request_key = sha256(requestKey).toString('ascii')
    this.request_key_expires_at = addHours(new Date(), 24);

    return requestKey
  }
}
