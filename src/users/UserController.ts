import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  InternalServerErrorException,
  NotAcceptableException
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { AuthUser } from '../decorators/AuthUser'
import { UserEntity } from "./UserEntity";
import { UserService } from './UserService'

@Controller('users')
export class UserController {

  constructor(
    private readonly userService: UserService
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

  @Post('confirm')
  @UseGuards(AuthGuard('oneTimeKey'))
  public async confirm(
    @AuthUser() user,
    @Body('password') password
  ) {
    if (password) {
      try {
        return await this.userService.confirm(user, password)
      } catch (err) {
        throw new InternalServerErrorException(err)
      }
    } else {
      throw new NotAcceptableException('Missing password')
    }
  }
}
