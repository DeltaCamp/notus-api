import { UserEntity } from '../users/UserEntity'
import { DappUserEntity } from '../dapp-users/DappUserEntity'

export function isUserEntity(userOrDappUser: UserEntity | DappUserEntity): boolean {
  return userOrDappUser instanceof UserEntity
}
