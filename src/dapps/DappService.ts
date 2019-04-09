import { Injectable } from '@nestjs/common';

import { DappEntity, UserEntity, DappUserEntity } from '../entities';
import { DappDto } from './DappDto';
import { rollbar } from '../rollbar'
import { Transaction } from '../typeorm/Transaction'
import { EntityManagerProvider } from '../typeorm/EntityManagerProvider'

@Injectable()
export class DappService {

  constructor(
    private readonly provider: EntityManagerProvider
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
  public async createDapp(
    user: UserEntity,
    dappDto: DappDto
  ): Promise<DappEntity> {
    const dapp = new DappEntity()
    dapp.name = dappDto.name
    await this.provider.get().save(dapp)

    const dappUser = new DappUserEntity()
    Object.assign(dappUser, {
      dapp,
      user,
      owner: true
    })
    await this.provider.get().save(dappUser)

    return dapp
  }
}
