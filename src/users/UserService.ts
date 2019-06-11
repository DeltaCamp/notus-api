import { Injectable } from '@nestjs/common';

import { MagicLinkView } from '../templates/MagicLinkView'
import { UserEntity } from '../entities';
import { rollbar } from '../rollbar'
import { MailJobPublisher } from '../jobs/MailJobPublisher'
import { keyHashHex } from '../utils/keyHashHex'
import { TemplateRenderer } from '../templates/TemplateRenderer';
import { ValidationException } from '../common/ValidationException';
import { validate } from 'class-validator';
import { UserDto } from './UserDto';
import { notDefined } from '../utils/notDefined';
import { SubscribeToMailchimpJobPublisher } from '../jobs/SubscribeToMailchimpJobPublisher';
import { SlackDeltaCampJobPublisher } from '../jobs/SlackDeltaCampJobPublisher';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { Service } from '../Service';

const debug = require('debug')('notus:UserService')

@Injectable()
export class UserService extends Service {

  constructor(
    @InjectConnection()
    connection: Connection,
    private readonly mailJobPublisher: MailJobPublisher,
    private readonly templateRenderer: TemplateRenderer,
    private readonly subscribeToMailchimp: SubscribeToMailchimpJobPublisher,
    private readonly slackDeltaCamp: SlackDeltaCampJobPublisher
  ) {
    super(connection)
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.manager().find(UserEntity);
  }

  async findOne(id): Promise<UserEntity> {
    return await this.manager().findOne(UserEntity, id)
  }

  async findOneOrFail(id): Promise<UserEntity> {
    if (notDefined(id)) { throw new Error('id must be defined') }
    return await this.manager().findOneOrFail(UserEntity, id)
  }

  public async findByEmailAndPassword(email: string, password: string): Promise<UserEntity> {
    let password_hash = keyHashHex(password)
    return this.manager().findOne(UserEntity, { email, password_hash })
  }

  public async createOrRequestMagicLink(email: string): Promise<UserEntity> {
    let user

    try {
      user = await this.manager().findOne(UserEntity, { email })

      if (!user) {
        user = new UserEntity()
        user.email = email
        user.isNew = true
      }

      const oneTimeKey = user.generateOneTimeKey()

      await this.validateUser(user)
      await this.manager().save(user)

      if (user.isNew) {
        this.sendWelcome(user, oneTimeKey)
        this.slackDeltaCamp.publish({ email: user.email })

        // move this to when they confirm their email?
        this.subscribeToMailchimp.publish({ email: user.email })
      } else {
        this.sendMagicLink(user, oneTimeKey)
      }

      return user
    } catch (e) {
      debug('e2', e)
      throw new Error(e)
    }
  }

  public async requestMagicLinkOrDoNothing(email: string): Promise<UserEntity> {
    const user = await this.manager().findOne(UserEntity, { email })

    if (user) {
      const oneTimeKey = user.generateOneTimeKey()
      await this.validateUser(user)
      await this.manager().save(user)
      this.sendMagicLink(user, oneTimeKey)
    }

    return user
  }

  public async confirm(user: UserEntity, password: string): Promise<void> {
    user.clearOneTimeKey()
    user.confirmedAt = new Date()
    user.password_hash = keyHashHex(password)
    await this.validateUser(user)
    await this.manager().save(user)
  }

  public async resendConfirmation(user: UserEntity): Promise<UserEntity> {
    this.doResendConfirmation(user)
    return user
  }

  async doResendConfirmation(user: UserEntity): Promise<void> {
    user.clearOneTimeKey()

    user.confirmedAt = null
    user.password_hash = null

    const oneTimeKey = user.generateOneTimeKey()
    await this.manager().save(user)
    
    this.sendWelcome(user, oneTimeKey)
  }

  public async update(user: UserEntity, userDto: UserDto): Promise<UserEntity> {

    if (userDto.name !== undefined) {
      user.name = userDto.name
    }

    if (userDto.etherscan_api_key !== undefined) {
      user.etherscan_api_key = userDto.etherscan_api_key
    }

    await this.manager().save(user)

    return user
  }

  public async findOneByOneTimeKey(oneTimeKey: string) {
    return await this.manager().findOne(UserEntity, { one_time_key_hash: keyHashHex(oneTimeKey) })
  }

  public async findOneOrFailByOneTimeKey(oneTimeKey: string) {
    return await this.manager().findOneOrFail(UserEntity, { one_time_key_hash: keyHashHex(oneTimeKey) })
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
