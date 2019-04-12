import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';
import { Field, Int, ObjectType, ID } from 'type-graphql';

import { DappUserEntity, RecipeEntity } from "../entities";

@ObjectType()
@Entity({ name: 'dapps' })
export class DappEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(type => DappUserEntity, dappUser => dappUser.dapp, {
    cascade: true
  })
  dappUsers: DappUserEntity[];

  @OneToMany(type => RecipeEntity, contract => contract.dapp)
  recipes: RecipeEntity[];

  @Field()
  @Column({ type: 'text', nullable: false })
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
