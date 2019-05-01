import { Injectable } from "@nestjs/common";

import { ActionContext } from './ActionContext'
import { MailJobPublisher } from '../jobs/MailJobPublisher'
import { SingleEventTemplateView } from '../templates/SingleEventTemplateView'
import { EventTemplateView } from '../templates/EventTemplateView'
import { TemplateRenderer } from '../templates/TemplateRenderer'
import { UserEntity } from "src/users/UserEntity";

@Injectable()
export class UserActionContextsHandler {

  constructor (
    private readonly templateRenderer: TemplateRenderer,
    private readonly mailJobPublisher: MailJobPublisher
  ) {}

  async handle(user: UserEntity, actionContexts: ActionContext[]) {
    const textEvents = []
    const htmlEvents = []

    actionContexts.forEach(actionContext => {
      const view = new SingleEventTemplateView(actionContext.matchContext, actionContext.event)
      textEvents.push(this.templateRenderer.render('event.single.template.text.mst', view))
      htmlEvents.push(this.templateRenderer.render('event.single.template.html.mst', view))
    })

    const text = this.templateRenderer.render('event.template.text.mst', new EventTemplateView(textEvents))
    const html = this.templateRenderer.render('event.template.html.mst', new EventTemplateView(htmlEvents))

    let subject: string
    if (actionContexts.length === 1) {
      subject = actionContexts[0].event.title
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