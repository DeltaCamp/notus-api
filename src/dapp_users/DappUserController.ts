import { Controller, Get, Post, Put, Delete, Request, Response, Body, Param, HttpStatus } from '@nestjs/common';
import { DappUserEntity } from "../dapp_users/DappUserEntity";
import { DappUserService } from './DappUserService'

@Controller('dapp-users')
export class DappUserController {

  constructor(
    private readonly dappUserService: DappUserService
  ) { }

  @Post('/')
  public async create(
    @Response() res,
    @Body('dappId') dappId,
    @Body('email') email
  ) {
    if (dappId && email) {
      try {
        await this.dappUserService.create();
        res.status(HttpStatus.CREATED).json({
          message: 'GOOD'
        });
      } catch (err) {
        console.error(err)
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error: 'INTERNAL_SERVER_ERROR'
        });
      }
    } else {
      res.status(HttpStatus.NOT_ACCEPTABLE).json({
        error: 'NOT_ACCEPTABLE: proper params data not included'
      });
    }
  }
}
