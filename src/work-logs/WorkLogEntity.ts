import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType, ID } from 'type-graphql';

@Entity({ name: 'work_logs' })
@ObjectType()
export class WorkLogEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id!: number;

  @Field()
  @Column({ type: 'int' })
  chainId: number;

  @Field()
  @Column({ type: 'int' })
  lastCompletedBlockNumber: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
