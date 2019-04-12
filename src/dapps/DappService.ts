import { Injectable } from '@nestjs/common';

import { DappEntity, UserEntity, DappUserEntity } from '../entities';
import { DappDto } from './DappDto';
import { rollbar } from '../rollbar'
import { Transaction } from '../typeorm/Transaction'
import { EntityManagerProvider } from '../typeorm/EntityManagerProvider'
import { DappUserService } from '../dapp-users/DappUserService'
import { EventTypeService } from '../event-types/EventTypeService'

@Injectable()
export class DappService {

  constructor(
    private readonly provider: EntityManagerProvider,
    private readonly dappUserService: DappUserService,
    private readonly eventTypeService: EventTypeService
  ) { }

  @Transaction()
  async findAll(): Promise<DappEntity[]> {
    return await this.provider.get().find(DappEntity);
  }

  @Transaction()
  async findOne(id: number): Promise<DappEntity> {
    return this.provider.get().findOne(DappEntity, id);
  }

  @Transaction()
  async findOneOrFail(id: number): Promise<DappEntity> {
    return this.provider.get().findOneOrFail(DappEntity, id);
  }

  @Transaction()
  async findOrCreate(user: UserEntity, dappDto: DappDto): Promise<DappEntity> {
    if (dappDto.id) {
      return await this.findOneOrFail(dappDto.id)
    } else {
      return this.createDapp(user, dappDto)
    }
  }

  @Transaction()
  public async createDapp(
    user: UserEntity,
    dappDto: DappDto
  ): Promise<DappEntity> {
    const dapp = new DappEntity()
    dapp.name = dappDto.name
    await this.provider.get().save(dapp)

    console.log('user is: ', user)

    const dappUser = new DappUserEntity()
    Object.assign(dappUser, {
      dapp,
      user,
      owner: true
    })
    await this.provider.get().save(dappUser)

    return dapp
  }

  @Transaction()
  async update(dappDto: DappDto) {
    const dapp = await this.findOneOrFail(dappDto.id)

    dapp.name = dappDto.name

    await this.provider.get().save(dapp)

    return dapp
  }

  @Transaction()
  async destroy(dappId: number) {
    const dapp = await this.findOneOrFail(dappId)
    await Promise.all(dapp.dappUsers.map((dappUser) => {
      return this.dappUserService.destroy(dappUser)
    }))

    await Promise.all(dapp.eventTypes.map((eventType => {
      return this.eventTypeService.destroy(eventType)
    })))

    await this.provider.get().delete(DappEntity, dapp.id)
  }
}
