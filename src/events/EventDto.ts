import { Field, InputType, ID } from 'type-graphql';

import { MatcherDto } from '../matchers/MatcherDto';
import { AppDto } from '../apps';

@InputType()
export class EventDto {
  @Field(type => ID, { nullable: true })
  id?: number;

  @Field(type => AppDto, { nullable: true })
  app: AppDto;

  @Field(({ nullable: true }))
  title: string;

  @Field({ nullable: true })
  scope: number;

  @Field({ nullable: true })
  runCount: number;

  @Field({ nullable: true })
  abiEventId: number;

  @Field({ nullable: true })
  contractId: number;

  @Field({ nullable: true })
  isPublic: boolean;

  @Field({ nullable: true })
  isActive: boolean;

  @Field({ nullable: true })
  parentId?: number;

  @Field({ nullable: true })
  deletedAt?: Date;

  @Field({ nullable: true })
  webhookUrl?: string;

  @Field({ nullable: true })
  webhookBody?: string;

  @Field({ nullable: true })
  color: string;

  @Field({ nullable: true })
  sendEmail: boolean;

  @Field(type => [MatcherDto], { nullable: true })
  matchers: MatcherDto[];
}
