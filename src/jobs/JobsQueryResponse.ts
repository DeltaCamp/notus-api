import { PagedQueryResponse } from "../dtos/PagedQueryResponse";
import { JobEntity } from '../entities'
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class JobsQueryResponse extends PagedQueryResponse {
  @Field(type => [JobEntity])
  jobs: JobEntity[];
}