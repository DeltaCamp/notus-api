import { Controller, Get, Post, Put, Delete, Request, Response, Body, Param, HttpStatus } from '@nestjs/common';
import { DappService } from "./dapp.service";
import { Dapp } from "../entity/dapp.entity";

@Controller('dapps')
export class DappController {

  constructor(
    private readonly dappService: DappService
  ) { }

  @Get()
  findAll(): Promise<Dapp[]> {
    return this.dappService.findAll();
  }

  @Post('/')
  public async create(
    @Response() res,
    @Body('dappName') dappName,
    @Body('email') email
  ) {
    const result = await this.dappService.create(dappName, email);
    res.status(HttpStatus.CREATED).json(result);
  }

  @Get('/confirm/:email/:confirmationCode')
  public async confirm(
    @Response() res,
    @Param('confirmationCode') confirmationCode,
    @Param('email') email
  ) {
    const result = await this.dappService.confirm(confirmationCode, email);
    res.status(HttpStatus.OK).json(result);
  }

  // @Put('/:id')
  // public async updateDapp(@Response() res,
  //   @Param('id') id,
  //   @Body('dappName') dappName,
  //   @Body('email') email
  // ) {
  //   const result = await this.dappService.updateDapp(id, dappName, email);
  //   res.status(HttpStatus.ACCEPTED).json(result);
  // }

  // @Delete('/:id')
  // public async deleteDapp(@Response() res,
  //   @Param('id') id) {
  //   const result = await this.dappService.deleteDapp(id);
  //   res.status(HttpStatus.ACCEPTED).json(result);
  // }


  // @Get()
  // public async getAllDapp(@Response() res) {
  //   const dapps = await this.dappService.findAll();
  //   res.status(HttpStatus.OK).json(dapps);
  // }

  // @Get('/:id')
  // public async getDapp(@Response() res,
  //   @Param('id') id) {
  //   const dapp = await this.dappService.getDapp(id);
  //   res.status(HttpStatus.OK).json(dapp);
  // }

}