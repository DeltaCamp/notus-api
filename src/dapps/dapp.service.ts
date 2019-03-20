import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dapp } from '../entity/dapp.entity';

import { resolveProtocolHostAndPort } from '../utils/resolveProtocolHostAndPort';
import { generateRandomBytes } from '../utils/generateRandomBytes';
// import { sendApiKeyEmail } from '../utils/sendApiKeyEmail';

@Injectable()
export class DappService {

  constructor(
    @InjectRepository(Dapp)
    private readonly dappRepository: Repository<Dapp>,
    private readonly mailerService: MailerService
  ) { }

  async findAll(): Promise<Dapp[]> {
    return await this.dappRepository.find();
  }

  sendApiKeyEmail = (dapp): void => {
    console.log('here')
    this.mailerService.sendMail({
      to: dapp.email,
      // from: 'noreply@nestjs.com',
      subject: 'Welcome - Your Notus API Key ✔',
      // text: 'welcome',
      // html: '<b>welcome</b>',
      template: 'test', // The `.pug` or `.hbs` extension is appended automatically.
      text: 'This is the text version of the email',
      context: {
        protocolHostAndPort: resolveProtocolHostAndPort(),
        email: dapp.email,
        apiKey: dapp.apiKey,
        dappName: dapp.dappName,
        confirmationCode: dapp.confirmationCode
      }
    })
      .then((val) => { console.log(val) })
      .catch((err) => { console.warn(err) });
  }

  // Don't return sensitive information, or perhaps don't
  // even return anything but a 200 in the controller
  async create(dappName, email): Promise<Dapp> {
    let dapp
    let dappEntity = await this.dappRepository.findOne({ dappName, email });

    console.log('dappEntity', dappEntity)
    
    try {
      if (dappEntity === undefined) {
        dappEntity = new Dapp();
        dappEntity.dappName = dappName;
        dappEntity.email = email;
        dappEntity.views = 0;
        dappEntity.apiKey = await generateRandomBytes();
        dappEntity.confirmationCode = await generateRandomBytes();

        dapp = await this.dappRepository.save(dappEntity);
      } else {
        dapp = dappEntity
      }

      if (!dapp.confirmed) {
        this.sendApiKeyEmail(dapp);
      }

      return dapp;
    } catch (err) {
      console.error(err)
      return err
    }
  }

  async confirm(confirmationCode, email): Promise<Dapp> {
    const dappEntity = await this.dappRepository.findOne({ confirmationCode, email });

    if (dappEntity === undefined) {
      return new Dapp()
    } else {
      dappEntity.confirmed = true;
      return await this.dappRepository.save(dappEntity);
    }
  }
  
}