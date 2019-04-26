import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  InternalServerErrorException,
  NotAcceptableException,
  UseFilters
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { AuthUser } from '../decorators/AuthUser'
import { UserEntity } from "./UserEntity";
import { UserService } from './UserService'
import { AuthJwtService } from '../auth/AuthJwtService'
import { RollbarExceptionsFilter } from '../filters/RollbarExceptionsFilter';

@UseFilters(new RollbarExceptionsFilter())
@Controller('users')
export class UserController {

  constructor(
    private readonly userService: UserService,
    private readonly authJwtService: AuthJwtService
  ) {}

  @Get('/')
  @UseGuards(AuthGuard())
  public async get(
    @AuthUser() user: UserEntity
  ) {
    return user
  }

  @Post('/')
  public async create(
    @Body('email') email
  ) {
    return await this.userService.createOrRequestMagicLink(email);
  }

  @Post('password-reset')
  public async passwordReset(
    @Body('email') email
  ) {
    return await this.userService.requestMagicLinkOrDoNothing(email);
  }

  @Post('confirm')
  @UseGuards(AuthGuard('oneTimeKey'))
  public async confirm(
    @AuthUser() user,
    @Body('password') password
  ) {
    if (password) {
      if (password.length < 8) {
        throw new NotAcceptableException('Password needs to be at least 8 characters')
      }

      try {
        await this.userService.confirm(user, password)
        return this.authJwtService.signIn(user)
      } catch (err) {
        throw new InternalServerErrorException(err)
      }
    } else {
      throw new NotAcceptableException('Missing password')
    }
  }
}
