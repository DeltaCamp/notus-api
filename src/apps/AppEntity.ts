import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  RelationId
} from 'typeorm';
import { Field, Int, ObjectType, ID } from 'type-graphql';

import { UserEntity, EventEntity } from "../entities";

@ObjectType()
@Entity({ name: 'apps' })
export class AppEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(type => UserEntity, (user: UserEntity) => user.apps)
  owner: UserEntity;

  @RelationId((app: AppEntity) => app.owner)
  ownerId: number;

  @OneToMany(type => EventEntity, (event: EventEntity) => event.app)
  events: EventEntity[];

  @Field()
  @Column({ type: 'text', nullable: false })
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
