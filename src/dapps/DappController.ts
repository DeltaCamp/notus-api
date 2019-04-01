import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards
} from '@nestjs/common'
import { AuthUser } from '../decorators/AuthUser'
import { AuthGuard } from '@nestjs/passport'

import { UserEntity } from '../users/UserEntity'
import { DappService } from './DappService'
import { DappEntity } from './DappEntity'

@Controller('dapps')
export class DappController {

  constructor(
    private readonly dappService: DappService
  ) {}

  @Post('/')
  @UseGuards(AuthGuard())
  public async create(
    @AuthUser() user: UserEntity,
    @Body('name') name: string
  ) {
    return await this.dappService.create(user, name)
  }

  @Get('/')
  public async get() {
    return await this.dappService.findAll()
  }
}
