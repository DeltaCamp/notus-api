import { Field, InputType, ID } from 'type-graphql';

import { MatcherDto } from '../matchers/MatcherDto';
import { AppDto } from '../apps';

@InputType()
export class EventDto {
  @Field(type => ID, { nullable: true })
  id?: number;

  @Field(type => AppDto, { nullable: true })
  app: AppDto;

  @Field()
  title: string;

  @Field({ nullable: true })
  scope: number;

  @Field({ nullable: true })
  abiEventId: number;

  @Field()
  isPublic: boolean;

  @Field({ nullable: true })
  parentId?: number;

  @Field({ nullable: true })
  deletedAt?: Date;

  @Field(type => [MatcherDto])
  matchers: MatcherDto[];
}
