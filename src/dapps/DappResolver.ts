import { UseGuards, UnauthorizedException } from '@nestjs/common'
import { Mutation, Resolver, Query, Args } from '@nestjs/graphql'
import { GqlAuthGuard } from '../auth/GqlAuthGuard'

import { GqlAuthUser } from '../decorators/GqlAuthUser'
import { UserEntity } from '../users/UserEntity'
import { DappEntity } from './DappEntity'
import { DappService } from './DappService'
import { DappDto } from './DappDto'

@Resolver(of => DappEntity)
export class DappResolver {

  constructor(
    private readonly dappService: DappService
  ) {}

  @Query(returns => DappEntity, { nullable: true })
  async findDapp(@Args('id') id: number): Promise<DappEntity> {
    return await this.dappService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => DappEntity)
  async createDapp(@GqlAuthUser() user: UserEntity, @Args('dapp') dappDto: DappDto): Promise<DappEntity> {
    console.log(user, dappDto)
    return await this.dappService.createDapp(null, dappDto)
  }
}
