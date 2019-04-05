import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';

import { MatchContext } from './MatchContext'
import { EventEntity } from '../events'
import { rollbar } from '../rollbar'

@Injectable()
export class MatchHandler {

  constructor (
    private readonly mailerService: MailerService
  ) {}

  async handle(matchContext: MatchContext, event: EventEntity) {
    this.mailerService.sendMail({
      to: event.user.email,
      subject: event.eventType.name,
      body: 'The event fired'
    }).catch(error => rollbar.error(error))
  }
}
