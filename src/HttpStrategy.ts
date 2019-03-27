import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './AuthService';

@Injectable()
export class HttpStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(token: string) {
    const dappUser = await this.authService.validateDappUser(token);
    if (!dappUser) {
      throw new UnauthorizedException();
    }
    return dappUser;
  }
}
