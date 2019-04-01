import { Controller, Get, Post, Put, Delete, Request, Response, Body, Param, HttpStatus, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { DappUserEntity } from "../dapp_users/DappUserEntity";
import { DappUserService } from './DappUserService'

@Controller('dapp-users')
export class DappUserController {

  constructor(
    private readonly dappUserService: DappUserService
  ) { }

  @Get('/:dappUserId')
  public async getDappUser(@Param('dappUserId') dappUserId) {
    if (dappUserId) {
      try {
        return await this.dappUserService.get(dappUserId)
      } catch (err) {
        throw new InternalServerErrorException(err)
      }
    } else {
      throw new NotAcceptableException('Missing dappUserId')
    }
  }

  @Post('/')
  public async create(
    @Body('dappId') dappId,
    @Body('dappName') dappName,
    @Body('email') email
  ) {
    return await this.dappUserService.create(dappId, dappName, email);
  }
}
