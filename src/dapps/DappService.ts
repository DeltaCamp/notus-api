import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { DappEntity } from './DappEntity';
import { UserEntity } from '../users/UserEntity';
import { DappUserEntity } from '../dapp_users/DappUserEntity'

import { rollbar } from '../rollbar'

@Injectable()
export class DappService {

  constructor(
    @InjectRepository(DappEntity)
    private readonly dappRepository: Repository<DappEntity>
  ) { }

  async findAll(): Promise<DappEntity[]> {
    return await this.dappRepository.find();
  }

  public async create(
    user: UserEntity,
    name: string
  ): Promise<DappEntity> {
    return await getConnection().transaction(async entityManager => {
      const dapp = new DappEntity()
      dapp.name = name
      entityManager.save(dapp)

      const dappUser = new DappUserEntity()
      Object.assign(dappUser, {
        dapp,
        user,
        owner: true
      })
      entityManager.save(dappUser)

      return dapp
    })
  }
}
