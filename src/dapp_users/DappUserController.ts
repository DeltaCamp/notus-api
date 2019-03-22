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
        await this.dappUserService.create(dappId, email);

        res.status(HttpStatus.CREATED).json({
          "status": "success",
          "data": {},
          "message": "Dapp User creation successful"
        });
      } catch (err) {
        console.error(err)
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          "status": "error",
          "data": {},
          "message": "INTERNAL_SERVER_ERROR"
        });
      }
    } else {
      res.status(HttpStatus.NOT_ACCEPTABLE).json({
        "status": "error",
        "data": {},
        "message": "NOT_ACCEPTABLE: proper params data not included"
      });
    }
  }
}
