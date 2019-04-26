import { UseGuards, UnauthorizedException, UseFilters } from '@nestjs/common'
import { Mutation, Resolver, Query, Args } from '@nestjs/graphql'
import { GqlAuthGuard } from '../auth/GqlAuthGuard'

import { GqlAuthUser } from '../decorators/GqlAuthUser'
import { UserEntity, AppEntity } from '../entities'
import { AppService } from './AppService'
import { AppDto } from './AppDto'
import { GqlRollbarExceptionFilter } from '../filters/GqlRollbarExceptionFilter';

@UseFilters(new GqlRollbarExceptionFilter())
@Resolver(of => AppEntity)
export class AppResolver {

  constructor(
    private readonly appService: AppService
  ) {}

  @Query(returns => AppEntity, { nullable: true })
  async app(@Args('id') id: number): Promise<AppEntity> {
    return await this.appService.findOne(id);
  }

  @Query(returns => [AppEntity], { nullable: false })
  async apps() {
    return await this.appService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => AppEntity)
  async createApp(@GqlAuthUser() user: UserEntity, @Args('app') appDto: AppDto): Promise<AppEntity> {
    return await this.appService.createApp(user, appDto)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => AppEntity)
  async updateApp(@GqlAuthUser() user: UserEntity, @Args('app') appDto: AppDto): Promise<AppEntity> {
    const app = await this.appService.findOneOrFail(appDto.id);
    const isOwner = app.ownerId === user.id;
    if (!isOwner) {
      throw new UnauthorizedException()
    }
    return await this.appService.update(appDto)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => AppEntity)
  async destroyApp(@GqlAuthUser() user: UserEntity, @Args('appId') appId: number): Promise<Boolean> {
    const app = await this.appService.findOneOrFail(appId);
    const isOwner = app.ownerId === user.id;
    if (!isOwner) {
      throw new UnauthorizedException()
    }
    await this.appService.destroy(appId)
    return true
  }
}
