import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'

import { DappUserEntity } from './DappUserEntity'

import { DappEntity } from '../dapps/DappEntity'
import { UserEntity } from '../users/UserEntity'

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
  }

}
