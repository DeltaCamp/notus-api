import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dapp } from './dapp.entity';

import { resolveProtocolHostAndPort } from '../utils/resolveProtocolHostAndPort';
import { generateRandomBytes } from '../utils/generateRandomBytes';

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

  // Don't return sensitive information, or perhaps don't
  // even return anything but a 200 in the controller
  async create(name, email): Promise<Dapp> {
    let dapp
    let dappEntity = await this.dappRepository.findOne({ name, email });

    try {
      if (dappEntity === undefined) {
        dappEntity = new Dapp();
        dappEntity.name = name;
        dappEntity.email = email;
        dappEntity.api_key = await generateRandomBytes();
        dappEntity.confirmation_code = await generateRandomBytes();

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
    const dappEntity = await this.dappRepository.findOne({
      confirmation_code: confirmationCode,
      email
    });

    if (dappEntity === undefined) {
      return new Dapp()
    } else {
      dappEntity.confirmed = true;
      return await this.dappRepository.save(dappEntity);
    }
  }
  
}