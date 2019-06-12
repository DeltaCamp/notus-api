import { Field, ObjectType, ID } from 'type-graphql';

@ObjectType()
export class JobSummary {

  @Field()
  createdCount: number;
  
  @Field()
  activeCount: number;

  @Field()
  completedCount: number;

  @Field()
  failedCount: number;
}
