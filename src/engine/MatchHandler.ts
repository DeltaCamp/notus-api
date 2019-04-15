import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';

import { MatchContext } from './MatchContext'
import { EventEntity } from '../entities'
import { rollbar } from '../rollbar'

const debug = require('debug')('notus:MatchHandler')

@Injectable()
export class MatchHandler {

  constructor (
    private readonly mailerService: MailerService
  ) {}

  async handle(matchContext: MatchContext, event: EventEntity) {
    const context = {
      ...matchContext,
      event
    }
    debug(`!!!!!!!!!!!!! FIRING !!!!!!!!!!!!!`)
    this.mailerService.sendMail({
      to: event.user.email,
      subject: event.title,
      template: 'event.template.pug',
      context
    }).catch(error => rollbar.error(error))
  }
}
