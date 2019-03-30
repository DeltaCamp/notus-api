import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserEntity } from './users/UserEntity'
import { DappUserEntity } from './dapp_users/DappUserEntity'
import { UserService } from './users/UserService'
import { DappUserService } from './dapp_users/DappUserService'

@Injectable()
export class AuthUserOrDappUserStrategy extends PassportStrategy(Strategy, 'userOrDappUser') {
  constructor(
    private readonly userService: UserService,
    private readonly dappUserService: DappUserService
  ) {
    super()
  }

  async validate(token: string): Promise<UserEntity | DappUserEntity> {
    let user: UserEntity = await this.userService.findOneByAccessKey(token)
    let dappUser: DappUserEntity
    if (!user) {
      dappUser = await this.dappUserService.findOneByAccessKey(token)
      if (dappUser && dappUser.access_key_expires_at < new Date()) {
        throw new UnauthorizedException()
      }
    } else if (user.access_key_expires_at < new Date()) {
      throw new UnauthorizedException()
    }
    return user || dappUser
  }
}
