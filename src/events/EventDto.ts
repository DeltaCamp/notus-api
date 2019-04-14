import { Field, InputType, ID } from 'type-graphql';

import { MatcherDto } from '../matchers/MatcherDto';
import { AppDto } from '../apps';

@InputType()
export class EventDto {
  @Field(type => ID, { nullable: true })
  id?: number;

  @Field(type => AppDto)
  app: AppDto;

  @Field()
  title: string;

  @Field()
  isPublic: boolean;

  @Field({ nullable: true })
  parent: EventDto;

  @Field(type => [MatcherDto])
  matchers: MatcherDto[];
}
