import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';

import { MatchContext } from './MatchContext'
import { EventEntity } from '../entities'
import { rollbar } from '../rollbar'
import { addArticle } from '../utils/addArticle'
import { Renderer } from './Renderer'

const debug = require('debug')('notus:MatchHandler')
const fs = require('fs');

@Injectable()
export class MatchHandler {

  private eventTemplateText: string;
  private eventTemplateHtml: string;

  constructor (
    private readonly mailerService: MailerService,
    private readonly renderer: Renderer
  ) {
    this.eventTemplateText = fs.readFileSync(__dirname + '/../../templates/event.template.text.mst', { encoding: 'utf8' })
    this.eventTemplateHtml = fs.readFileSync(__dirname + '/../../templates/event.template.html.mst', { encoding: 'utf8' })
  }

  async handle(matchContext: MatchContext, event: EventEntity) {
    const text = this.renderer.render(this.eventTemplateText, matchContext, event)
    const html = this.renderer.render(this.eventTemplateHtml, matchContext, event)
    debug(`!!!!!!!!!!!!! FIRING EVENT ${event.id} !!!!!!!!!!!!!`)
    debug(text)
    this.mailerService.sendMail({
      to: event.user.email,
      subject: `${addArticle(event.formatTitle(), { an: 'An', a: 'A' })} occurred`,
      text,
      html 
    }).catch(error => rollbar.error(error))
  }
}
