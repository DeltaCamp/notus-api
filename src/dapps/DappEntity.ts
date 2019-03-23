import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';
import { DappUserEntity } from "../dapp_users/DappUserEntity";

@Entity({ name: 'dapps' })
export class DappEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(type => DappUserEntity, dapp_user => dapp_user.dapp, {
    cascade: true
  })
  dapp_users: DappUserEntity[];

  // @OneToMany(type => UserEntity, user => user.dapp)
  // owner: DappUserEntity.find({ owner: true });

  @Column({ length: 120 })
  name: string = '';

  @Column()
  api_key: string = '';

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
