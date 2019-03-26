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
    @Response() res,
    @Body('dappName') dappName,
    @Body('email') email
  ) {
    if (dappName && email) {
      try {
        const user = await this.userService.findOrCreate(email);
        await this.dappService.findOrCreate(dappName, user);

        res.status(HttpStatus.CREATED).json(
          notusJsonResponse('success', {}, 'SUCCESS: Dapp Created')
        );
      } catch (err) {
        console.error(err)
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
          notusJsonResponse('error', {}, 'INTERNAL_SERVER_ERROR')
        );
      }
    } else {
      res.status(HttpStatus.NOT_ACCEPTABLE).json(
        notusJsonResponse('error', {}, 'NOT_ACCEPTABLE: proper params data not included')
      );
    }
  }

  @Get('/confirm/:email/:confirmation_code')
  public async confirm(
    @Response() res,
    @Param('confirmation_code') confirmationCode,
    @Param('email') email
  ) {
    const result = await this.dappService.confirm(confirmationCode, email);
    res.status(HttpStatus.OK).json(
      notusJsonResponse('success', result, 'SUCCESS: Confirmation ok')
    );
  }
}
