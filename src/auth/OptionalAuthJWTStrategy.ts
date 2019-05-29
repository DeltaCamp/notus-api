import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthJwtService } from './AuthJwtService';
import { JwtPayload } from './JwtPayload';

const debug = require('debug')('notus:AuthJwtService')

@Injectable()
export class OptionalAuthJWTStrategy extends PassportStrategy(Strategy, 'optionalJwt') {
  constructor(private readonly authService: AuthJwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    debug('payload', payload)
    return await this.authService.validateUser(payload);
  }
}
