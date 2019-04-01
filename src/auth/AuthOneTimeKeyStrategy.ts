import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserService } from '../users/UserService'

@Injectable()
export class AuthOneTimeKeyStrategy extends PassportStrategy(Strategy, 'oneTimeKey') {
  constructor(private readonly userService: UserService) {
    super()
  }

  async validate(token: string) {
    const user = await this.userService.findOneByOneTimeKey(token);
    if (!user) {
      throw new UnauthorizedException();
    } else if (user.one_time_key_expires_at < new Date()) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
