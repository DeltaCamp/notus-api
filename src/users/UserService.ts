import { Injectable } from '@nestjs/common';

import { MagicLinkView } from '../templates/MagicLinkView'
import { UserEntity } from '../entities';
import { rollbar } from '../rollbar'
import { MailJobPublisher } from '../jobs/MailJobPublisher'
import { keyHashHex } from '../utils/keyHashHex'
import { Transaction } from '../transactions/Transaction'
import { EntityManagerProvider } from '../transactions/EntityManagerProvider'
import { TemplateRenderer } from '../templates/TemplateRenderer';
import { ValidationException } from '../common/ValidationException';
import { validate } from 'class-validator';

@Injectable()
export class UserService {

  constructor(
    private readonly provider: EntityManagerProvider,
    private readonly mailJobPublisher: MailJobPublisher,
    private readonly templateRenderer: TemplateRenderer
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

    await this.validateUser(user)

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

      await this.validateUser(user)

      await this.provider.get().save(user)

      this.sendMagicLink(user, oneTimeKey)
    }

    return user
  }

  @Transaction()
  public async confirm(user: UserEntity, password: string): Promise<void> {
    user.clearOneTimeKey()
    user.password_hash = keyHashHex(password)
    await this.validateUser(user)
    await this.provider.get().save(user)
  }

  @Transaction()
  public async findOneByOneTimeKey(oneTimeKey: string) {
    return await this.provider.get().findOne(UserEntity, { one_time_key_hash: keyHashHex(oneTimeKey) })
  }

  @Transaction()
  public async findOneOrFailByOneTimeKey(oneTimeKey: string) {
    return await this.provider.get().findOneOrFail(UserEntity, { one_time_key_hash: keyHashHex(oneTimeKey) })
  }

  public sendWelcome(user: UserEntity, oneTimeKey: string) {
    const view = new MagicLinkView(oneTimeKey)
    this.mailJobPublisher.sendMail({
      to: user.email,
      subject: 'Welcome to Notus',
      text: this.templateRenderer.renderTemplate('welcome.template.text.mst', view),
      html: this.templateRenderer.renderHtmlTemplate('welcome.template.html.mst', view)
    }).catch(error => rollbar.error(error))
  }

  public sendMagicLink(user: UserEntity, oneTimeKey: string) {
    const view = new MagicLinkView(oneTimeKey)
    this.mailJobPublisher.sendMail({
      to: user.email,
      subject: 'Your Magic Access Link',
      text: this.templateRenderer.renderTemplate('magic_link.template.text.mst', view),
      html: this.templateRenderer.renderHtmlTemplate('magic_link.template.html.mst', view)
    }).catch(error => rollbar.error(error))
  }

  async validateUser(user: UserEntity) {
    let errors = await validate(user)
    if (errors.length > 0) {
      throw new ValidationException(`User is invalid`, errors)
    }
  }
}
