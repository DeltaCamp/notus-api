import { Field, InputType, ID } from 'type-graphql';
import { MatcherDto } from '../matchers'

@InputType()
export class EventMatcherDto {
  @Field(type => ID, { nullable: true })
  id: number;

  @Field({ nullable: true })
  eventId: number;

  @Field(type => MatcherDto)
  matcher: MatcherDto;
}
