import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DappEntity } from './DappEntity';

import { resolveProtocolHostAndPort } from '../utils/resolveProtocolHostAndPort';
import { generateRandomBytes } from '../utils/generateRandomBytes';

@Injectable()
export class DappService {

  constructor(
    @InjectRepository(DappEntity)
    private readonly dappRepository: Repository<DappEntity>,
    private readonly mailerService: MailerService
  ) { }

  async findAll(): Promise<DappEntity[]> {
    return await this.dappRepository.find();
  }

  sendApiKeyEmail = (dapp): void => {
    this.mailerService.sendMail({
      to: dapp.email,
      // from: 'noreply@nestjs.com',
      subject: 'Welcome - Your Notus API Key ✔',
      // text: 'welcome',
      // html: '<b>welcome</b>',
      template: 'send_api_key.template', // The `.pug` or `.hbs` extension is appended automatically.
      text: 'This is the text version of the email',
      context: {
        protocolHostAndPort: resolveProtocolHostAndPort(),
        email: dapp.email,
        apiKey: dapp.api_key,
        name: dapp.name,
        confirmationCode: dapp.confirmation_code
      }
    })
      .then((val) => { console.log(val) })
      .catch((err) => { console.warn(err) });
  }

  async create(email, user): Promise<User> {
    const dappEntity = new Dapp();

    dappEntity.name = name;
    dappEntity.api_key = await generateRandomBytes();

    dappEntity.dapp_user = user;

    return await this.dappRepository.save(dappEntity);
  }

  async findOrCreate(name, user): Promise<Dapp> {
    // TODO: USE QUERY BUILDER HERE TO SELECT ACROSS RELATIONS
    let dapp = await this.dappRepository.findOne({ name, email });

    try {
      if (!dapp) {
        dapp = await this.create(name, user);
      }

      // if (!dapp.confirmed) {
      //   this.sendApiKeyEmail(dapp);
      // }

      return dapp;
    } catch (err) {
      console.error(err)
      return err
    }
  }

  // async confirm(confirmationCode, email): Promise<Dapp> {
  //   return new Promise(() => { })

  //   // const dappEntity = await this.dappRepository.findOne({
  //   //   confirmation_code: confirmationCode,
  //   //   email
  //   // });

  //   // if (dappEntity === undefined) {
  //   //   return new Dapp()
  //   // } else {
  //   //   dappEntity.confirmed = true;
  //   //   return await this.dappRepository.save(dappEntity);
  //   // }
  // }
  
}
