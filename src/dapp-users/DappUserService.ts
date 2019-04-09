import {
  Injectable
} from '@nestjs/common'
import {
  Transaction,
  EntityManagerProvider
} from '../typeorm'

import { DappUserEntity } from '../entities'

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
}
