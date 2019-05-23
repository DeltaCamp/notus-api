import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { rollbar } from '../rollbar'

import { UserService } from '../users/UserService'

@Injectable()
export class AuthOneTimeKeyStrategy extends PassportStrategy(Strategy, 'oneTimeKey') {
  constructor(private readonly userService: UserService) {
    super()
  }

  async validate(token: string) {
    const user = await this.userService.findOneOrFailByOneTimeKey(token);
    if (!user) {
      rollbar.error(`Error signing user in - could not find user with token: ${token}`)
      throw new UnauthorizedException()
    } else if (user.one_time_key_expires_at < new Date()) {
      const newDate = new Date()
      rollbar.error(`Error signing user in, ${user.id}: one_time_key_expires_at: ${user.one_time_key_expires_at} is older than the current date: ${newDate.toString()}`)
      throw new UnauthorizedException()
    }
    return user
  }
}
