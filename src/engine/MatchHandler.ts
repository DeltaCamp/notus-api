import { Injectable } from '@nestjs/common';

import { MatchContext } from './MatchContext'
import {
  EventEntity,
  UserEntity
} from '../entities'
import { addArticle } from '../utils/addArticle'
import { MailJobPublisher } from '../jobs/MailJobPublisher'
import { UserMailJobBuffers } from './UserMailJobBuffers'
import { MailJob } from '../jobs/MailJob'
import { EventService } from '../events/EventService'
import { TemplateRenderer } from '../templates/TemplateRenderer';
import { MatchTemplateView } from './MatchTemplateView'

const debug = require('debug')('notus:engine:MatchHandler')

@Injectable()
export class MatchHandler {
  private blockBuffers: Map<number, UserMailJobBuffers>;

  constructor (
    private readonly eventService: EventService,
    private readonly mailJobPublisher: MailJobPublisher,
    private readonly renderer: TemplateRenderer
  ) {
    this.blockBuffers = new Map<number, UserMailJobBuffers>()
  }

  async handle(matchContext: MatchContext, event: EventEntity) {
     // in case an event was previously deactivated, just bounce
    if (!event.isActive) { return false }
    debug(`!!!!!!!!!!!!! FIRING EVENT ${event.id} !!!!!!!!!!!!!`)
    const text = this.renderer.renderTemplate('event.template.text.mst', new MatchTemplateView(matchContext, event))
    const html = this.renderer.renderHtmlTemplate('event.template.html.mst', new MatchTemplateView(matchContext, event))
    const mailJob = {
      to: event.user.email,
      subject: `${addArticle(event.formatTitle(), { an: 'An', a: 'A' })} occurred`,
      text,
      html 
    }
    this.addMailJob(matchContext.block.number, event.user, mailJob)
    if (event.runCount !== -1) { //once the event is fired, deactivate it
      await this.eventService.deactivateEvent(event)
    }
    return true
  }

  async startBlock(blockNumber: number) {
    this.blockBuffers[blockNumber] = new UserMailJobBuffers(this.mailJobPublisher)
  }

  async endBlock(blockNumber: number) {
    await this.blockBuffers[blockNumber].flush()
    this.blockBuffers[blockNumber] = null
  }

  addMailJob(blockNumber: number, user: UserEntity, mailJob: MailJob) {
    this.blockBuffers[blockNumber].add(user, mailJob)
  }
}
