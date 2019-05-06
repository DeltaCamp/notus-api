import { Field, Int, ObjectType, ID } from 'type-graphql';

import { SolidityDataType } from '../common/SolidityDataType'
import { MetaDataType } from './MetaDataType'

@ObjectType()
export class SourceEntity {
  @Field(type => ID)
  source: string;

  @Field()
  title: string;

  @Field()
  dataType: SolidityDataType;

  @Field({ nullable: true })
  metaDataType: MetaDataType;
}
