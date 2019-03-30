import { UserEntity } from '../users/UserEntity'
import { DappUserEntity } from '../dapp_users/DappUserEntity'

export function isUserEntity(userOrDappUser: UserEntity | DappUserEntity): boolean {
  return userOrDappUser instanceof UserEntity
}
