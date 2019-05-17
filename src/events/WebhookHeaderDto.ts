import { Field, InputType, ID } from 'type-graphql';

@InputType()
export class WebhookHeaderDto {
  @Field(type => ID, { nullable: true })
  id?: number;

  @Field(({ nullable: false }))
  key: string;

  @Field(({ nullable: false }))
  value: string;

  @Field({ nullable: true })
  eventId: number;
}
