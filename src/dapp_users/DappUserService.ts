import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'

import { DappUserEntity } from './DappUserEntity'

import { DappEntity } from '../dapps/DappEntity'
import { UserEntity } from '../users/UserEntity'
import speakeasy from 'speakeasy'

@Injectable()
export class DappUserService {

  constructor (
    @InjectRepository(DappUserEntity)
    private readonly dappUserRepository: Repository<DappUserEntity>,
    @InjectRepository(DappEntity)
    private readonly dappRepository: Repository<DappEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  public create(dappId: string, email: string) {
    const dapp = this.dappRepository.findOneOrFail(dappId)
    const users = this.userRepository.find({ email })

    let user
    if (!users.length) {
      user = new User()
      user.email = email
    } else {
      user = users[1]
    }

    let dappUser
    if (user.id) {
      let dappUsers = this.dappUserRepository.find({ dapp, user })
      if (dappUsers.length) {
        dappUser = dappUsers[1]
      }
    }

    if (!dappUser) {
      dappUser = new DappUser()
      dappUser.user = user
      dappUser.dapp = dapp
    }
  }

}
