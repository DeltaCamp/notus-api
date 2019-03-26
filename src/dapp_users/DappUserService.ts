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

  public async create(dappId: string, email: string) {
    const dapp = await this.dappRepository.findOneOrFail(dappId)
    const users = await this.userRepository.find({ email })

    let user
    if (!users.length) {
      user = new UserEntity()
      user.email = email
    } else {
      user = users[0]
    }

    let dappUser
    if (user && user.id) {
      let dappUsers = await this.dappUserRepository.find({ dapp, user })
      if (dappUsers.length) {
        dappUser = dappUsers[0]
      }
    }

    if (!dappUser) {
      dappUser = new DappUserEntity()
      dappUser.user = user
      dappUser.dapp = dapp
    }

    const requestKey = Buffer.from(dappUser.generateRequestKey(), 'ascii').toString('hex')

    this.dappUserRepository.save(dappUser)

    await this.mailerService.sendMail({
      to: user.email,
      // from: 'noreply@nestjs.com',
      subject: `Welcome - Confirm Your Subscription to ${dapp.name}`,
      // text: 'welcome',
      // html: '<b>welcome</b>',
      template: 'confirmation.template.pug', // The `.pug` or `.hbs` extension is appended automatically.
      text: `Confirmation subscription to ${dapp.name}`,
      context: {
        protocolHostAndPort: resolveProtocolHostAndPort(),
        name: dapp.name,
        requestKey
      }
    })

    return dappUser
  }

  public async confirm(requestKeyHex: string) {
    let requestKey = Buffer.from(requestKeyHex, 'hex').toString('ascii')
    let requestKeyHashed = sha256(requestKey).toString('ascii')
    let dappUser = await this.dappUserRepository.findOneOrFail({ requestKey: requestKeyHashed })
    const accessKey = dappUser.generateAccessKey(requestKey)
    this.dappUserRepository.save(dappUser)

    return accessKey
  }
}
