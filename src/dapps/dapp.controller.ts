import { Controller, Get, Post, Put, Delete, Request, Response, Body, Param, HttpStatus } from '@nestjs/common';
import { DappService } from "./dapp.service";
import { DappEntity } from "./DappEntity";

@Controller('dapps')
export class DappController {

  constructor(
    private readonly dappService: DappService
  ) { }

  @Get()
  findAll(): Promise<DappEntity[]> {
    return this.dappService.findAll();
  }

  @Post('/')
  public async create(
    @Response() res,
    @Body('name') name,
    @Body('email') email
  ) {
    if (name && email) {
      try {
        await this.dappService.create(name, email);
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

  @Get('/confirm/:email/:confirmation_code')
  public async confirm(
    @Response() res,
    @Param('confirmation_code') confirmationCode,
    @Param('email') email
  ) {
    const result = await this.dappService.confirm(confirmationCode, email);
    res.status(HttpStatus.OK).json(result);
  }

  // @Put('/:id')
  // public async updateDappEntity(@Response() res,
  //   @Param('id') id,
  //   @Body('name') name,
  //   @Body('email') email
  // ) {
  //   const result = await this.dappService.updateDappEntity(id, name, email);
  //   res.status(HttpStatus.ACCEPTED).json(result);
  // }

  // @Delete('/:id')
  // public async deleteDappEntity(@Response() res,
  //   @Param('id') id) {
  //   const result = await this.dappService.deleteDappEntity(id);
  //   res.status(HttpStatus.ACCEPTED).json(result);
  // }


  // @Get()
  // public async getAllDappEntity(@Response() res) {
  //   const dapps = await this.dappService.findAll();
  //   res.status(HttpStatus.OK).json(dapps);
  // }

  // @Get('/:id')
  // public async getDappEntity(@Response() res,
  //   @Param('id') id) {
  //   const dapp = await this.dappService.getDappEntity(id);
  //   res.status(HttpStatus.OK).json(dapp);
  // }

}