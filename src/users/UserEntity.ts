import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';
import { DappUserEntity } from "../dapp_users/DappUserEntity";

import { keyHashHex } from '../utils/keyHashHex'
import { newKeyHex } from '../utils/newKeyHex'
import { newKeyExpiryDate } from '../utils/newKeyExpiryDate'

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(type => DappUserEntity, dapp_user => dapp_user.user)
  dapp_users: DappUserEntity[];

  @Column({ length: 120 })
  name: string = '';

  @Column({ length: 320 })
  email: string = '';

  @Column()
  confirmed: boolean = false;

  @Column({ type: 'varchar', nullable: true })
  access_key_hash: string;

  @Column({ type: 'timestamptz', nullable: true })
  access_key_expires_at: Date;

  @Column({ type: 'varchar', nullable: true })
  access_request_key_hash: string;

  @Column({ type: 'timestamptz', nullable: true })
  request_key_expires_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  generateAccessKey(request_key) {
    if (!this.access_request_key_hash || this.access_request_key_hash !== keyHashHex(request_key)) {
      throw new Error(`Invalid request key`)
    }
    this.request_key_expires_at = new Date()
    const access_key = newKeyHex()
    this.access_key_hash = keyHashHex(access_key)
    this.access_key_expires_at = newKeyExpiryDate()
    this.confirmed = true
    this.access_request_key_hash = null
    this.request_key_expires_at = null

    return access_key
  }

  generateRequestKey() {
    const requestKey = newKeyHex()
    this.access_request_key_hash = keyHashHex(requestKey)
    this.request_key_expires_at = newKeyExpiryDate()

    return requestKey
  }
}
