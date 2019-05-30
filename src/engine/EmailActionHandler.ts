import { Injectable } from "@nestjs/common";

import { ActionContext } from './ActionContext'
import { MailJobPublisher } from '../jobs/MailJobPublisher'
import { EventTemplateView } from '../templates/EventTemplateView'
import { TemplateRenderer } from '../templates/TemplateRenderer'
import {
  UserEntity,
  EventLogEntity
} from "../entities";
import { SingleEventTemplateView } from "../templates/SingleEventTemplateView";
import { EventLogService } from "../event-logs/EventLogService";
import { EventService } from "../events";
import { EmailHaltWarningView } from "../templates/EmailHaltWarningView";
import { transactionContextRunner } from "../transactions";

const debug = require('debug')('notus:engine:EmailActionHandler')

@Injectable()
export class EmailActionHandler {

  constructor (
    private readonly templateRenderer: TemplateRenderer,
    private readonly mailJobPublisher: MailJobPublisher,
    private readonly eventLogService: EventLogService,
    private readonly eventService: EventService
  ) {}

  async handle(user: UserEntity, actionContexts: ActionContext[]) {
    debug(`handle received ${actionContexts.length} for user id ${user.id} and email ${user.email}`)

    const views: SingleEventTemplateView[] = await this.actionContextsToTemplateViews(actionContexts)

    if (!views.length) {
      debug(`no views are valid`)
      return
    }

    const text = this.templateRenderer.renderTemplate('event.template.text.mst', new EventTemplateView(views))
    const html = this.templateRenderer.renderHtmlTemplate('event.template.html.mst', new EventTemplateView(views))

    let subject: string
    if (views.length === 1) {
      subject = `${views[0].title()} occurred in block ${views[0].block.number()}`
    } else {
      subject = `${views.length} new events in block ${views[0].block.number()}`
    }

    debug(`!!!!!!!!! emailing subject "${subject}"`)

    await this.mailJobPublisher.sendMail({
      to: user.email,
      subject,
      text,
      html
    })
  }

  async actionContextsToTemplateViews(actionContexts: ActionContext[]): Promise<SingleEventTemplateView[]> {
    const views = []
    let i: number
    for (i = 0; i < actionContexts.length; i++) {
      const actionContext = actionContexts[i]
      const { event, matchContext } = actionContext
      if (event.hasEmailAction()) {
        debug('has email action')
        await transactionContextRunner(async () => {        
          const eventLog = await this.eventLogService.logEvent(event)
          if (eventLog.isWindowFull()) {
            debug('window is full')
            await this.haltEmails(actionContext, eventLog)
          } else {
            debug('adding view')
            views.push(new SingleEventTemplateView(matchContext, event))          
          }
        })
      } else {
        debug('does not have email action')
      }
    }
    return views
  }

  async haltEmails(actionContext: ActionContext, eventLog: EventLogEntity) {
    if (eventLog.warningSent) { return }
    await this.eventLogService.sendWarning(eventLog)
    await this.sendHaltEmail(actionContext, eventLog)
    await this.eventService.haltEmails(actionContext.event)
  }

  async sendHaltEmail(actionContext: ActionContext, eventLog: EventLogEntity) {
    const { user } = actionContext.event
    const view = new EmailHaltWarningView(actionContext, eventLog)
    const text = this.templateRenderer.renderTemplate('email_halt_warning.text.mst', view)
    const html = this.templateRenderer.renderHtmlTemplate('email_halt_warning.html.mst', view)
    const subject = `Emails for "${actionContext.event.formatTitle()}" have been suspended`

    await this.mailJobPublisher.sendMail({
      to: user.email,
      subject,
      text,
      html
    })
  }
}
