import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Dapp {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 120 })
    name: string = '';

    @Column()
    api_key: string = '';

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}
