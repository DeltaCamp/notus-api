import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dapp } from '../entity/dapp.entity';

@Injectable()
export class DappService {

  constructor(
    @InjectRepository(Dapp)
    private readonly dappRepository: Repository<Dapp>
  ) { }

  async findAll(): Promise<Dapp[]> {
    return await this.dappRepository.find();
  }

  async createDapp(dappName, email): Promise<Dapp> {
    const dapp = new Dapp();
    dapp.dappName = dappName;
    dapp.email = email;
    dapp.views = 0;
    
    return await this.dappRepository.save(dapp);
  }
  
}