import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dapp } from '../entity/dapp.entity';

const crypto = require('crypto');

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

  sendApiKeyEmail(dappInstance): void {
    this
      .mailerService
      .sendMail({
        to: dappInstance.email, // sender address
        // from: 'noreply@nestjs.com', // list of receivers
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        html: '<b>welcome</b>', // HTML body content
      })
      .then(() => {})
      .catch(() => {});
  }

  async generateApiKey(): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(256, function (ex, buffer) {
        if (ex) {
          reject("error generating token");
        }
        
        const token = crypto
          .createHash("sha1")
          .update(buffer)
          .digest("hex");

        resolve(token);
      });
    });
  }

  // Don't return sensitive information, or perhaps don't
  // even return anything but 200
  async createDapp(dappName, email): Promise<Dapp> {
    let dappEntity = await this.dappRepository.findOne({ dappName, email });

    if (dappEntity === undefined) {
      try {
        dappEntity = new Dapp();
        dappEntity.dappName = dappName;
        dappEntity.email = email;
        dappEntity.views = 0;
        dappEntity.apiKey = await this.generateApiKey();;
      } catch (e) {
        console.error(e)
      }
    }
    
    const dappInstance = await this.dappRepository.save(dappEntity);

    if (!dappInstance.confirmed) {
      this.sendApiKeyEmail(dappInstance);
    }

    return dappInstance;
  }
  
}