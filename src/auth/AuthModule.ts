import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthJwtService } from './AuthJwtService';
import { AuthJwtStrategy } from './AuthJwtStrategy';
import { AuthController } from './AuthController'
import { AuthOneTimeKeyStrategy } from './AuthOneTimeKeyStrategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secretOrPrivateKey: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: parseInt(process.env.JWT_EXPIRES_IN),
      },
    }),
  ],
  providers: [
    AuthJwtService, AuthJwtStrategy, AuthOneTimeKeyStrategy
  ],
  controllers: [
    AuthController
  ],
  exports: [
    PassportModule, AuthJwtService
  ]
})
export class AuthModule {}
