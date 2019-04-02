import { UserEntity } from '../../users/UserEntity'
import { DappUserEntity } from '../../dapp-users/DappUserEntity'
import { isUserEntity } from '../isUserEntity'

describe('isUserEntity', () => {
  it('should correctly identify a UserEntity', () => {
    expect(isUserEntity(new UserEntity())).toBeTruthy()
  })

  it('should correctly identify a non-UserEntity', () => {
    expect(isUserEntity(new DappUserEntity())).toBeFalsy()
  })
})
