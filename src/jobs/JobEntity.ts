import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType, ID } from 'type-graphql';

import { JsonScalar } from '../graphql/JsonScalar'
import { IntervalScalar } from '../graphql/IntervalScalar';

@Entity({ name: 'job', schema: 'pgboss' })
@ObjectType()
export class JobEntity {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id!: number;

  @Field()
  @Column({ type: 'text' })
  name: string;

  @Field()
  @Column({ type: 'integer' })
  priority: number;

  @Field(type => JsonScalar)
  @Column({ type: 'jsonb' })
  data: any;

  @Field()
  @Column({ type: 'text' })
  state: string;

  @Field()
  @Column({ type: 'integer' })
  retrylimit: number;

  @Field()
  @Column({ type: 'integer' })
  retrycount: number;

  @Field()
  @Column({ type: 'integer' })
  retrydelay: number;

  @Field()
  @Column({ type: 'boolean' })
  retrybackoff: boolean;

  @Field()
  @Column({ type: 'timestamp with time zone' })
  startafter: Date;
  
  @Field({ nullable: true })
  @Column({ type: 'timestamp with time zone' })
  startedon: Date;

  @Field({ nullable: true })
  @Column({ type: 'text' })
  singletonkey: string;

  @Field({ nullable: true })
  @Column({ type: 'timestamp with time zone' })
  singletonon: Date;

  @Field(type => IntervalScalar)
  @Column({ type: 'interval' })
  expirein: any;

  @Field()
  @Column({ type: 'timestamp with time zone' })
  createdon: Date;

  @Field({ nullable: true })
  @Column({ type: 'timestamp with time zone' })
  completedon: Date;
}
