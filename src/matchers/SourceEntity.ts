import { Field, Int, ObjectType, ID } from 'type-graphql';

import { SolidityDataType } from '../common/SolidityDataType'

@ObjectType()
export class SourceEntity {
  @Field(type => ID)
  source: string;

  @Field()
  title: string;

  @Field()
  dataType: SolidityDataType;
}
