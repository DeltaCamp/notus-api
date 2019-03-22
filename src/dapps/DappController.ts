import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Request,
  Response,
  Body,
  Param,
  HttpStatus
} from '@nestjs/common';
import { DappService } from "./DappService";
import { DappEntity } from "./DappEntity";

import { UserService } from "../users/UserService";

@Controller('dapps')
export class DappController {

  constructor(
    private readonly dappService: DappService,
    private readonly userService: UserService
  ) { }

  @Get()
  findAll(): Promise<DappEntity[]> {
    return this.dappService.findAll();
  }

  @Post('/')
  public async create(
    @Response() res,
    @Body('dappName') dappName,
    @Body('email') email
  ) {
    if (dappName && email) {
      try {
        const user = await this.userService.findOrCreate(email);
        await this.dappService.findOrCreate(name, user);

        res.status(HttpStatus.CREATED).json({
          "status": "success",
          "data": {},
          "message": 'GOOD'
        });
      } catch (err) {
        console.error(err)
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          "status": "error",
          "data": {},
          "message": 'INTERNAL_SERVER_ERROR'
        });
      }
    } else {
      res.status(HttpStatus.NOT_ACCEPTABLE).json({
        "status": "error",
        "data": {},
        "message": 'NOT_ACCEPTABLE: proper params data not included'
      });
    }
  }

  @Get('/confirm/:email/:confirmation_code')
  public async confirm(
    @Response() res,
    @Param('confirmation_code') confirmationCode,
    @Param('email') email
  ) {
    const result = await this.dappService.confirm(confirmationCode, email);
    res.status(HttpStatus.OK).json({
      "status": "success",
      "data": result,
      "message": "Confirmation successful"
    });
  }

}