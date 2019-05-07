import { Field, ID, InputType } from 'type-graphql';
import { AbiDto } from '../abis/AbiDto';

@InputType()
export class ContractDto {
  @Field(type => ID, { nullable: true })
  id?: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  address?: string;

  @Field(type => AbiDto, { nullable: true })
  abi?: AbiDto;
}