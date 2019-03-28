import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nest-modules/mailer';
import { Repository } from 'typeorm'
const querystring = require('querystring');

import { DappUserEntity } from './DappUserEntity'
import { DappEntity } from '../dapps/DappEntity'
import { UserEntity } from '../users/UserEntity'
import { resolveProtocolHostAndPort } from '../utils/resolveProtocolHostAndPort';
import { sha256 } from '../utils/sha256'

@Injectable()
export class DappUserService {

  constructor (
    @InjectRepository(DappUserEntity)
    private readonly dappUserRepository: Repository<DappUserEntity>,
    @InjectRepository(DappEntity)
    private readonly dappRepository: Repository<DappEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly mailerService: MailerService
  ) {}

  public async get(dappUserId: string) {
    return await this.dappUserRepository.findOneOrFail(dappUserId)
  }

  public async create(dappId: string, dappName: string, email: string) {
    let owner = false
    let dapp
    if (dappId) {
      dapp = await this.dappRepository.findOneOrFail(dappId)
    } else {
      dapp = new DappEntity()
      dapp.name = dappName
      this.dappRepository.save(dapp)
      owner = true
    }

    let user = await this.userRepository.findOne({ email })
    if (!user) {
      user = new UserEntity()
      user.email = email
    }

    let dappUser
    if (dapp.id && user.id) {
      dappUser = await this.dappUserRepository.findOne({ dapp, user })
    }

    if (!dappUser) {
      dappUser = new DappUserEntity()
      dappUser.user = user
      dappUser.dapp = dapp
      dappUser.owner = owner
    }

    const requestKey = dappUser.generateRequestKey()

    this.dappUserRepository.save(dappUser)

    if (owner) {
      this.sendNewDappMail(dapp, user, requestKey)
    } else {
      this.sendSubscriptionMail(dapp, user, requestKey)
    }

    return dappUser
  }

  public async findOneOrFail(id) {
    return await this.dappUserRepository.findOneOrFail(id)
  }

  public async findOneByAccessKey(accessKey: string) {
    console.log('received :' , accessKey)
    let accessKeyHashed = sha256(accessKey).toString('hex')
    console.log('looking for ', accessKeyHashed)
    return await this.dappUserRepository.findOneOrFail({ access_key: accessKeyHashed })
  }

  public async confirm(requestKey: string) {
    let requestKeyHashed = sha256(requestKey).toString('hex')
    let dappUser = await this.dappUserRepository.findOneOrFail({ request_key: requestKeyHashed })
    const accessKey = dappUser.generateAccessKey(requestKey)
    dappUser.confirmed = true
    dappUser.request_key = null
    dappUser.request_key_expires_at = null
    this.dappUserRepository.save(dappUser)

    return {
      accessKey
    }
  }


  public async sendSubscriptionMail(dapp, user, requestKey) {
    await this.mailerService.sendMail({
      to: user.email,
      // from: 'noreply@nestjs.com',
      subject: `Welcome - Confirm Your Subscription to ${dapp.name}`,
      // text: 'welcome',
      // html: '<b>welcome</b>',
      template: 'confirmation.template.pug', // The `.pug` or `.hbs` extension is appended automatically.
      text: `Confirmation subscription to ${dapp.name}`,
      context: {
        notusNetworkUri: process.env.NOTUS_NETWORK_URI,
        name: dapp.name,
        requestKey
      }
    })
  }

  public async sendNewDappMail(dapp, user, requestKey) {
    await this.mailerService.sendMail({
      to: user.email,
      // from: 'noreply@nestjs.com',
      subject: `Welcome - Confirm Your New App ${dapp.name}`,
      template: 'send_api_key.template.pug', // The `.pug` or `.hbs` extension is appended automatically.
      text: `Created App ${dapp.name}`,
      context: {
        notusNetworkUri: process.env.NOTUS_NETWORK_URI,
        name: dapp.name,
        requestKey
      }
    })
  }
}
