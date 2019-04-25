import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './UserController';
import { UserService } from './UserService';
import { UserEntity } from '../entities';
import { UserResolver } from './UserResolver'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity
    ])
  ],
  providers: [
    UserService, UserResolver
  ],
  controllers: [
    UserController
  ],
  exports: [
    UserService
  ]
})
export class UserModule {}
