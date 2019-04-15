import { Injectable } from '@nestjs/common';

import { AppEntity, UserEntity } from '../entities';
import { AppDto } from './AppDto';
import { rollbar } from '../rollbar'
import { Transaction } from '../transactions/Transaction'
import { EntityManagerProvider } from '../transactions/EntityManagerProvider'
import { EventService } from '../events/EventService'

@Injectable()
export class AppService {

  constructor(
    private readonly provider: EntityManagerProvider,
    private readonly eventService: EventService
  ) { }

  @Transaction()
  async findAll(): Promise<AppEntity[]> {
    return await this.provider.get().find(AppEntity);
  }

  @Transaction()
  async findOne(id: number): Promise<AppEntity> {
    return this.provider.get().findOne(AppEntity, id);
  }

  @Transaction()
  async findOneOrFail(id: number): Promise<AppEntity> {
    return this.provider.get().findOneOrFail(AppEntity, id);
  }

  @Transaction()
  async findOrCreate(user: UserEntity, appDto: AppDto): Promise<AppEntity> {
    if (appDto.id) {
      return await this.findOneOrFail(appDto.id)
    } else {
      return this.createApp(user, appDto)
    }
  }

  @Transaction()
  public async createApp(
    user: UserEntity,
    appDto: AppDto
  ): Promise<AppEntity> {
    const app = new AppEntity()
    
    app.owner = user;
    app.name = appDto.name

    await this.provider.get().save(app)

    return app
  }

  @Transaction()
  async update(appDto: AppDto) {
    const app = await this.findOneOrFail(appDto.id)

    app.name = appDto.name

    await this.provider.get().save(app)

    return app
  }

  @Transaction()
  async destroy(appId: number) {
    const app = await this.findOneOrFail(appId)
    
    await Promise.all(app.events.map((event => {
      return this.eventService.destroy(event)
    })))

    await this.provider.get().delete(AppEntity, app.id)
  }
}
