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
import { DappUser } from '../decorators/DappUser'

@Controller('notifications')
export class NotificationController {

  constructor(
    private readonly dappUserService: DappUserService,
    private readonly notificationGateway: NotificationGateway,
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
    let notification = await this.notificationService.create(
      dappUser,
      contractAddress,
      topics,
      subject,
      body
    )
    this.notificationGateway.add(`${notification.id}`)
    return notification
  }

  @Delete('/:notificationId')
  @UseGuards(AuthGuard())
  public async destroy(
    @DappUser() dappUser,
    @Param('notificationId') notificationId
  ) {
    let notification = await this.notificationService.find(notificationId)
    if (notification.dapp_user.id !== dappUser.id) {
      throw new ForbiddenException()
    }

    await this.notificationService.destroy(notification)

    await this.notificationGateway.remove(notificationId)

    return notification;
  }
}
