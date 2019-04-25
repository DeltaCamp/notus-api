import { Injectable } from '@nestjs/common';

import { MatchContext } from './MatchContext'
import { EventEntity } from '../entities'
import { rollbar } from '../rollbar'
import { addArticle } from '../utils/addArticle'
import { Renderer } from './Renderer'
import { MailJobPublisher } from '../jobs/MailJobPublisher'

const debug = require('debug')('notus:engine:MatchHandler')
const fs = require('fs');

@Injectable()
export class MatchHandler {

  private eventTemplateText: string;
  private eventTemplateHtml: string;

  constructor (
    private readonly mailJobPublisher: MailJobPublisher,
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
    this.mailJobPublisher.sendMail({
      to: event.user.email,
      subject: `${addArticle(event.formatTitle(), { an: 'An', a: 'A' })} occurred`,
      text,
      html 
    }).catch(error => rollbar.error(error))
  }
}
