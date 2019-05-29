import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

import { UserService } from '../users/UserService';
import { JwtPayload } from './JwtPayload';
import { UserEntity } from '../entities';

const debug = require('debug')('notus:AuthJwtService')

@Injectable()
export class AuthJwtService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(user: UserEntity): Promise<string> {
    // In the real-world app you shouldn't expose this method publicly
    // instead, return a token once you verify user credentials
    debug('user', user)
    const payload: JwtPayload = { userId: user.id };
    return this.jwtService.sign(payload);
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    debug('payload', payload)
    return await this.userService.findOneOrFail(payload.userId);
  }
}
