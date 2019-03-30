import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  ForbiddenException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'
import { NotificationEntity } from "./NotificationEntity";
import { DappUserEntity } from '../dapp_users/DappUserEntity'
import { NotificationService } from './NotificationService'
import { NotificationGateway } from './NotificationGateway'
import { DappUserService } from '../dapp_users/DappUserService'
import { AuthUser } from '../decorators/AuthUser'
import { AuthDappUser } from '../decorators/AuthDappUser'

@Controller('notifications')
export class NotificationController {

  constructor(
    private readonly dappUserService: DappUserService,
    private readonly notificationGateway: NotificationGateway,
    private readonly notificationService: NotificationService
  ) { }

  @Post('/')
  @UseGuards(AuthGuard('userOrDappUser'))
  public async create(
    @AuthUser() user,
    @AuthDappUser() dappUser,
    @Body('contractAddress') contractAddress: string,
    @Body('topics') topics: string[],
    @Body('subject') subject: string,
    @Body('body') body: string
  ) {
    let notification = await this.notificationService.create(
      user,
      contractAddress,
      topics,
      subject,
      body
    )
    this.notificationGateway.add(`${notification.id}`)
    return notification
  }

  @Delete('/:notificationId')
  @UseGuards(AuthGuard('userOrDappUser'))
  public async destroy(
    @AuthUser() user,
    @AuthDappUser() dappUser,
    @Param('notificationId') notificationId
  ) {
    let notification = await this.notificationService.find(notificationId)
    if (notification.dapp_user.id !== user.id) {
      throw new ForbiddenException()
    }

    await this.notificationService.destroy(notification)

    await this.notificationGateway.remove(notificationId)

    return notification;
  }
}
