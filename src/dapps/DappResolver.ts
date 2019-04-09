import { UseGuards, UnauthorizedException } from '@nestjs/common'
import { Mutation, Resolver, Query, Args } from '@nestjs/graphql'
import { GqlAuthGuard } from '../auth/GqlAuthGuard'

import { GqlAuthUser } from '../decorators/GqlAuthUser'
import { UserEntity, DappEntity } from '../entities'
import { DappService } from './DappService'
import { DappDto } from './DappDto'

@Resolver(of => DappEntity)
export class DappResolver {

  constructor(
    private readonly dappService: DappService
  ) {}

  @Query(returns => DappEntity, { nullable: true })
  async dapp(@Args('id') id: number): Promise<DappEntity> {
    return await this.dappService.findOne(id);
  }

  @Query(returns => [DappEntity], { nullable: false })
  async dapps() {
    return await this.dappService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => DappEntity)
  async createDapp(@GqlAuthUser() user: UserEntity, @Args('dapp') dappDto: DappDto): Promise<DappEntity> {
    return await this.dappService.createDapp(user, dappDto)
  }
}
