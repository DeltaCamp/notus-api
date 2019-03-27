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
  HttpStatus,
  InternalServerErrorException,
  NotAcceptableException
} from '@nestjs/common';
import { DappService } from "./DappService";
import { DappEntity } from "./DappEntity";
import { UserService } from "../users/UserService";
import { notusJsonResponse } from "../utils/notusJsonResponse";

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
    @Body('dappName') dappName,
    @Body('email') email
  ) {
    if (dappName && email) {
      try {
        const user = await this.userService.findOrCreate(email);
        return await this.dappService.findOrCreate(dappName, user);
      } catch (err) {
        console.error(err)
        throw new InternalServerErrorException(err)
      }
    } else {
      throw new NotAcceptableException('NOT_ACCEPTABLE: proper params data not included')
    }
  }

  @Post('/confirm')
  public async confirm(
    @Param('confirmation_code') confirmationCode,
    @Param('email') email
  ) {
    return await this.dappService.confirm(confirmationCode, email);
  }
}
