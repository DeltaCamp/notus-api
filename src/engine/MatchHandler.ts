import { Injectable } from '@nestjs/common';

import { MatchContext } from './MatchContext'
import {
  EventEntity,
  UserEntity
} from '../entities'
import { addArticle } from '../utils/addArticle'
import { Renderer } from './Renderer'
import { MailJobPublisher } from '../jobs/MailJobPublisher'
import { UserMailJobBuffers } from './UserMailJobBuffers'
import { MailJob } from '../jobs/MailJob'

const debug = require('debug')('notus:engine:MatchHandler')
const fs = require('fs');

@Injectable()
export class MatchHandler {

  private eventTemplateText: string;
  private eventTemplateHtml: string;

  private blockBuffers: Map<number, UserMailJobBuffers>;

  constructor (
    private readonly mailJobPublisher: MailJobPublisher,
    private readonly renderer: Renderer
  ) {
    this.eventTemplateText = fs.readFileSync(__dirname + '/../../templates/event.template.text.mst', { encoding: 'utf8' })
    this.eventTemplateHtml = fs.readFileSync(__dirname + '/../../templates/event.template.html.mst', { encoding: 'utf8' })
    this.blockBuffers = new Map<number, UserMailJobBuffers>()
  }

  async handle(matchContext: MatchContext, event: EventEntity) {
    const text = this.renderer.render(this.eventTemplateText, matchContext, event)
    const html = this.renderer.render(this.eventTemplateHtml, matchContext, event)
    debug(`!!!!!!!!!!!!! FIRING EVENT ${event.id} !!!!!!!!!!!!!`)
    const mailJob = {
      to: event.user.email,
      subject: `${addArticle(event.formatTitle(), { an: 'An', a: 'A' })} occurred`,
      text,
      html 
    }
    this.addMailJob(matchContext.block.number, event.user, mailJob)
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
