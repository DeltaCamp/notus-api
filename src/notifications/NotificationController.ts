import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'
import { NotificationEntity } from "./NotificationEntity";
import { DappUserEntity } from '../dapp_users/DappUserEntity'
import { NotificationService } from './NotificationService'
import { DappUserService } from '../dapp_users/DappUserService'
import { DappUser } from '../decorators/DappUser'

@Controller('notifications')
export class NotificationController {

  constructor(
    private readonly dappUserService: DappUserService,
    private readonly notificationService: NotificationService
  ) { }

  @Post('/')
  @UseGuards(AuthGuard())
  public async create(
    @DappUser() dappUser,
    @Body('contractAddress') contractAddress: string,
    @Body('topics') topics: string[],
    @Body('subject') subject: string,
    @Body('body') body: string
  ) {
    return await this.notificationService.create(
      dappUser,
      contractAddress,
      topics,
      subject,
      body
    )
  }

  @Delete('/:notificationId')
  @UseGuards(AuthGuard())
  public async destroy(
    @DappUser() dappUser,
    @Param('notificationId') notificationId
  ) {

  }
}
