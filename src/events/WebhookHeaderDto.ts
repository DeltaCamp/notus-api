import { Field, InputType, ID } from 'type-graphql';

@InputType()
export class WebhookHeaderDto {
  @Field(type => ID, { nullable: true })
  id?: number;

  @Field(({ nullable: true }))
  key: string;

  @Field(({ nullable: true }))
  value: string;

  @Field({ nullable: true })
  eventId?: number;
}
