import { Controller, Post, Get } from '@nestjs/common';
import { Connection } from 'typeorm';
// import { CreateDappDto } from './create-dapp.dto';

@Controller('dapps')
export class DappController {
  @Post()
  async create() {
  // async create(@Body() createDappDto: CreateDappDto) {
    let status

    status = 'ok'

    return status
  }
}
