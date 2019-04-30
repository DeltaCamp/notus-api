import {
  Controller,
  Get,
  Query,
  UnauthorizedException,
  NotAcceptableException,
  UseFilters
} from '@nestjs/common'

import { UserService } from '../users/UserService'
import { AuthJwtService } from './AuthJwtService'
import { RollbarExceptionsFilter } from '../filters/RollbarExceptionsFilter';

@UseFilters(RollbarExceptionsFilter)
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
    if (password.length < 8) {
      throw new NotAcceptableException('Password needs to be at least 8 characters')
    }
    
    let userEntity = await this.userService.findByEmailAndPassword(email, password)
    if (!userEntity) {
      throw new UnauthorizedException()
    }
    return this.authJwtService.signIn(userEntity)
  }
}
