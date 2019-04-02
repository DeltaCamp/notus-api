import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nest-modules/mailer';
import { Repository } from 'typeorm';
import { UserEntity } from './UserEntity';

import { rollbar } from '../rollbar'
import { generateRandomBytes } from '../utils/generateRandomBytes';
import { keyHashHex } from '../utils/keyHashHex'

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly mailerService: MailerService
  ) { }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOne(id): Promise<UserEntity> {
    return await this.userRepository.findOne(id)
  }

  public async findByEmailAndPassword(email: string, password: string): Promise<UserEntity> {
    let password_hash = keyHashHex(password)
    return this.userRepository.findOne({ email, password_hash })
  }

  public async createOrRequestMagicLink(email: string): Promise<UserEntity> {
    let user = await this.userRepository.findOne({ email })

    let newUser = !user
    if (newUser) {
      user = new UserEntity()
      user.email = email
    }

    const oneTimeKey = user.generateOneTimeKey()

    this.userRepository.save(user)

    if (newUser) {
      this.sendWelcome(user, oneTimeKey)
    } else {
      this.sendMagicLink(user, oneTimeKey)
    }

    return user
  }

  public async requestMagicLinkOrDoNothing(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ email })

    if (user) {
      const oneTimeKey = user.generateOneTimeKey()

      await this.userRepository.save(user)

      this.sendMagicLink(user, oneTimeKey)
    }

    return user
  }

  public async confirm(user: UserEntity, password: string): Promise<void> {
    user.clearOneTimeKey()
    user.password_hash = keyHashHex(password)
    await this.userRepository.save(user)
  }

  public async findOneByOneTimeKey(oneTimeKey: string) {
    return await this.userRepository.findOneOrFail({ one_time_key_hash: keyHashHex(oneTimeKey) })
  }

  public sendWelcome(user: UserEntity, oneTimeKey: string) {
    this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Notus Network',
      template: 'welcome.template.pug', // The `.pug` or `.hbs` extension is appended automatically.
      context: {
        notusNetworkUri: process.env.NOTUS_NETWORK_URI,
        oneTimeKey
      }
    }).catch(error => rollbar.error(error))
  }

  public sendMagicLink(user: UserEntity, oneTimeKey: string) {
    this.mailerService.sendMail({
      to: user.email,
      subject: 'Your Magic Access Link',
      template: 'magic_link.template.pug', // The `.pug` or `.hbs` extension is appended automatically.
      context: {
        notusNetworkUri: process.env.NOTUS_NETWORK_URI,
        oneTimeKey
      }
    }).catch(error => rollbar.error(error))
  }
}
