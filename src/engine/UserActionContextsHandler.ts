import { Injectable } from "@nestjs/common";

import { ActionContext } from './ActionContext'
import { MailJobPublisher } from '../jobs/MailJobPublisher'
import { SingleEventTemplateView } from '../templates/SingleEventTemplateView'
import { EventTemplateView } from '../templates/EventTemplateView'
import { TemplateRenderer } from '../templates/TemplateRenderer'
import { UserEntity } from "src/users/UserEntity";

const debug = require('debug')('notus:engine:UserActionContextsHandler')

@Injectable()
export class UserActionContextsHandler {

  constructor (
    private readonly templateRenderer: TemplateRenderer,
    private readonly mailJobPublisher: MailJobPublisher
  ) {}

  async handle(user: UserEntity, actionContexts: ActionContext[]) {
    debug(`handle received ${actionContexts.length} for user id ${user.id} and email ${user.email}`)

    const events = actionContexts.map(actionContext => new SingleEventTemplateView(actionContext.matchContext, actionContext.event))

    const text = this.templateRenderer.renderTemplate('event.template.text.mst', new EventTemplateView(events))
    const html = this.templateRenderer.renderHtmlTemplate('event.template.html.mst', new EventTemplateView(events))

    let subject: string
    if (actionContexts.length === 1) {
      subject = `${actionContexts[0].event.title} occurred in block ${actionContexts[0].matchContext.block.number}`
    } else {
      subject = `${actionContexts.length} new events in block ${actionContexts[0].matchContext.block.number}`
    }

    await this.mailJobPublisher.sendMail({
      to: user.email,
      subject,
      text,
      html
    })
  }
}