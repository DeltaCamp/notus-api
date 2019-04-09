import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';

import { DappUserEntity, EventEntity } from '../entities'

import { keyHashHex } from '../utils/keyHashHex'
import { newKeyHex } from '../utils/newKeyHex'
import { newKeyExpiryDate } from '../utils/newKeyExpiryDate'

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(type => DappUserEntity, dappUser => dappUser.user)
  dappUsers: DappUserEntity[];

  @OneToMany(type => EventEntity, event => event.user)
  events: EventEntity[];

  @Column({ length: 120 })
  name: string = '';

  @Column({ length: 320 })
  email: string = '';

  @Column()
  confirmed: boolean = false;

  @Column({ type: 'varchar', nullable: true })
  one_time_key_hash: string;

  @Column({ type: 'timestamptz', nullable: true })
  one_time_key_expires_at: Date;

  @Column ({ type: 'text', nullable: true })
  password_hash: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  public clearOneTimeKey(): void {
    this.confirmed = true
    this.one_time_key_hash = null
    this.one_time_key_expires_at = null
  }

  public generateOneTimeKey(): string {
    const oneTimeKey = newKeyHex()
    this.one_time_key_hash = keyHashHex(oneTimeKey)
    this.one_time_key_expires_at = newKeyExpiryDate()

    return oneTimeKey
  }
}
