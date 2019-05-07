import { Field, ObjectType, ID } from 'type-graphql';

@ObjectType()
export class MetaDataTypeEntity {
  @Field(type => ID)
  metaDataType: string;

  @Field()
  title: string;
}
