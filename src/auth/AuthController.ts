import {
  Controller,
  Body,
  Get,
  Query,
  UnauthorizedException
} from '@nestjs/common'

import { UserEntity } from '../users/UserEntity'
import { UserService } from '../users/UserService'
import { AuthJwtService } from './AuthJwtService'

@Controller()
export class AuthController {

  constructor (
    private readonly userService: UserService,
    private readonly authJwtService: AuthJwtService
  ) {}

  @Get('/sign-in')
  public async signIn(
    @Query('email') email: string,
    @Query('password') password: string
  ) {
    console.log('SIGN-IN: ', email, password)
    let userEntity = await this.userService.findByEmailAndPassword(email, password)
    if (!userEntity) {
      throw new UnauthorizedException()
    }
    return this.authJwtService.signIn(userEntity)
  }
}
