import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './UserController';
import { UserService } from './UserService';
import { UserEntity } from '../users/UserEntity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity
    ])
  ],
  providers: [
    UserService
  ],
  controllers: [
    UserController
  ],
  exports: [
    UserService
  ]
})
export class UserModule {}
