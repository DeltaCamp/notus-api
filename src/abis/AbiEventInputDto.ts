import { Field, ID, InputType } from 'type-graphql';

import { MetaDataType } from '../matchers/MetaDataType'

@InputType()
export class AbiEventInputDto {
  @Field(type => ID, { nullable: true })
  id?: number;

  @Field({ nullable: true })
  isPublic?: boolean;

  @Field({ nullable: true })
  metaType?: MetaDataType;
}
