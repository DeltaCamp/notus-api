import { Field, Int, ObjectType, ID } from 'type-graphql';

import { VariableType } from './VariableType'
import { VariableTypeTitle } from './VariableTypeTitle'
import { VariableTypeType } from './VariableTypeType'

@ObjectType()
export class VariableTypeEntity {
  @Field(type => ID)
  id: VariableType;

  @Field()
  title: VariableTypeTitle;

  @Field(type => String)
  type: VariableTypeType;
}
