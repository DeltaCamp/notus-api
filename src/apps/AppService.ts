import { Injectable } from '@nestjs/common';

import { AppEntity, UserEntity } from '../entities';
import { AppDto } from './AppDto';
import { EventService } from '../events/EventService'
import { notDefined } from '../utils/notDefined';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { Service } from '../Service';

@Injectable()
export class AppService extends Service {

  constructor(
    @InjectConnection()
    connection: Connection,
    private readonly eventService: EventService
  ) { 
    super(connection)
  }

  async findAll(): Promise<AppEntity[]> {
    return await this.manager().find(AppEntity);
  }

  async findOne(id: number): Promise<AppEntity> {
    return this.connection.manager.findOne(AppEntity, id);
  }

  async findOneOrFail(id: number): Promise<AppEntity> {
    if (notDefined(id)) { throw new Error('id must be defined') }
    return this.connection.manager.findOneOrFail(AppEntity, id);
  }

  async findOrCreate(user: UserEntity, appDto: AppDto): Promise<AppEntity> {
    if (appDto.id) {
      return await this.findOneOrFail(appDto.id)
    } else {
      return this.createApp(user, appDto)
    }
  }

  public async createApp(
    user: UserEntity,
    appDto: AppDto
  ): Promise<AppEntity> {
    const app = new AppEntity()
    
    app.owner = user;
    app.name = appDto.name

    await this.manager().save(app)

    return app
  }

  async update(appDto: AppDto) {
    const app = await this.findOneOrFail(appDto.id)

    app.name = appDto.name

    await this.manager().save(app)

    return app
  }

  async destroy(appId: number) {
    const app = await this.findOneOrFail(appId)
    
    await Promise.all(app.events.map((event => {
      return this.eventService.deleteEvent(event.id) // soft delete ...
    })))

    await this.manager().delete(AppEntity, app.id) // soft delete?
  }
}
