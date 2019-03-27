import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';
import { DappUserEntity } from "../dapp_users/DappUserEntity";

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

  @Column()
  confirmation_code: string = '';

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
