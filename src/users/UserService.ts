import { Injectable } from '@nestjs/common';

import { UserEntity } from '../entities';
import { rollbar } from '../rollbar'
import { MailJobPublisher } from '../jobs/MailJobPublisher'
import { keyHashHex } from '../utils/keyHashHex'
import { Transaction } from '../transactions/Transaction'
import { EntityManagerProvider } from '../transactions/EntityManagerProvider'

@Injectable()
export class UserService {

  constructor(
    private readonly provider: EntityManagerProvider,
    private readonly mailJobPublisher: MailJobPublisher
  ) { }

  @Transaction()
  async findAll(): Promise<UserEntity[]> {
    return await this.provider.get().find(UserEntity);
  }

  @Transaction()
  async findOne(id): Promise<UserEntity> {
    return await this.provider.get().findOne(UserEntity, id)
  }

  @Transaction()
  public async findByEmailAndPassword(email: string, password: string): Promise<UserEntity> {
    let password_hash = keyHashHex(password)
    return this.provider.get().findOne(UserEntity, { email, password_hash })
  }

  @Transaction()
  public async createOrRequestMagicLink(email: string): Promise<UserEntity> {
    let user = await this.provider.get().findOne(UserEntity, { email })

    let newUser = !user
    if (newUser) {
      user = new UserEntity()
      user.email = email
    }

    const oneTimeKey = user.generateOneTimeKey()

    this.provider.get().save(user)

    if (newUser) {
      this.sendWelcome(user, oneTimeKey)
    } else {
      this.sendMagicLink(user, oneTimeKey)
    }

    return user
  }

  @Transaction()
  public async requestMagicLinkOrDoNothing(email: string): Promise<UserEntity> {
    const user = await this.provider.get().findOne(UserEntity, { email })

    if (user) {
      const oneTimeKey = user.generateOneTimeKey()

      await this.provider.get().save(user)

      this.sendMagicLink(user, oneTimeKey)
    }

    return user
  }

  @Transaction()
  public async confirm(user: UserEntity, password: string): Promise<void> {
    user.clearOneTimeKey()
    user.password_hash = keyHashHex(password)
    await this.provider.get().save(user)
  }

  @Transaction()
  public async findOneByOneTimeKey(oneTimeKey: string) {
    return await this.provider.get().findOneOrFail(UserEntity, { one_time_key_hash: keyHashHex(oneTimeKey) })
  }

  public sendWelcome(user: UserEntity, oneTimeKey: string) {
    this.mailJobPublisher.sendMail({
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
    this.mailJobPublisher.sendMail({
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
