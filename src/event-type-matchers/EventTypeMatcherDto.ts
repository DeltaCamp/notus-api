import { Field, InputType, ID } from 'type-graphql';
import { MatcherDto } from '../matchers'

@InputType()
export class EventTypeMatcherDto {
  @Field(type => ID, { nullable: true })
  id: number;

  @Field({ nullable: true })
  eventTypeId: number;

  @Field(type => MatcherDto)
  matcher: MatcherDto;
}
