import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  RelationId
} from 'typeorm';
import { Field, Int, ObjectType, ID } from 'type-graphql';

import {
  RecipeMatcherEntity,
  DappEntity,
  EventEntity
} from '../entities';

@ObjectType()
@Entity({ name: 'recipes' })
export class RecipeEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(type => DappEntity)
  @ManyToOne(type => DappEntity, dapp => dapp.recipes, {
    nullable: false
  })
  dapp: DappEntity;

  @RelationId((recipe: RecipeEntity) => recipe.dapp)
  dappId: number;

  @Field()
  @Column({ type: 'text', nullable: false })
  name: string = '';

  // Fixed default variables: ie. a contractAddress at 0x1234 that gets set for every event
  @Field(type => [RecipeMatcherEntity])
  @OneToMany(type => RecipeMatcherEntity, recipeMatcher => recipeMatcher.recipe)
  recipeMatchers: RecipeMatcherEntity[];

  @OneToMany(type => EventEntity, event => event.recipe)
  events: EventEntity[];

  @Field(type => Date)
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field(type => Date)
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
