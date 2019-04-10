import {
  Injectable
} from '@nestjs/common'
import {
  Transaction,
  EntityManagerProvider
} from '../typeorm'

import { DappUserEntity } from '../entities'

const debug = require('debug')('notus:DappUserService')

@Injectable()
export class DappUserService {

  constructor (
    private readonly provider: EntityManagerProvider
  ) {}

  @Transaction()
  async isOwner(dappId, userId): Promise<boolean> {
    const dappUser: DappUserEntity = await this.provider.get().createQueryBuilder()
      .select('dapp_users')
      .from(DappUserEntity, 'dapp_users')
      .innerJoin('dapp_users.dapp', 'dapps')
      .where('dapp_users.owner = :isOwner AND dapps.id = :dappId', { isOwner: true, dappId })
      .getOne()
    return !!dappUser;
  }

  @Transaction()
  async destroy(dappUser: DappUserEntity) {
    await this.provider.get().delete(DappUserEntity, dappUser.id)
  }

  @Transaction()
  async findAll(parameters): Promise<DappUserEntity[]> {
    return await this.provider.get().find(DappUserEntity, parameters)
  }
}
