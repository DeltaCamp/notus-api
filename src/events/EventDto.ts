import { Field, InputType, ID } from 'type-graphql';

import { MatcherDto } from '../matchers/MatcherDto';
import { AppDto } from 'src/apps';

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

  @Field()
  parentId: number;

  @Field(type => [MatcherDto])
  matchers: MatcherDto[];
}
