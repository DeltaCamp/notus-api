import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserService } from './users/UserService'

@Injectable()
export class AuthUserStrategy extends PassportStrategy(Strategy, 'user') {
  constructor(private readonly userService: UserService) {
    super()
  }

  async validate(token: string) {
    const user = await this.userService.findOneByAccessKey(token);
    if (!user) {
      throw new UnauthorizedException();
    } else if (user.access_key_expires_at < new Date()) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
