import { Injectable } from "@nestjs/common";

import { ActionContext } from './ActionContext'
import { TemplateRenderer } from '../templates/TemplateRenderer'
import { SingleEventTemplateView } from "../templates/SingleEventTemplateView";
import { WebhookJobPublisher } from "../jobs/WebhookJobPublisher";
import { rollbar } from "../rollbar";

const debug = require('debug')('notus:engine:WebhookActionHandler')

@Injectable()
export class WebhookActionHandler {

  constructor (
    private readonly templateRenderer: TemplateRenderer,
    private readonly webhookJobPublisher: WebhookJobPublisher
  ) {}

  async handle(actionContexts: ActionContext[]) {
    const eventViews = actionContexts.reduce((views: SingleEventTemplateView[], actionContext: ActionContext): SingleEventTemplateView[] => {
      const { matchContext, event } = actionContext
      if (event.webhookUrl) {
        views.push(new SingleEventTemplateView(matchContext, event))
      }
      return views
    }, [])

    debug(`Firing ${eventViews.length} events`)

    await Promise.all(eventViews.map(async (eventView: SingleEventTemplateView) => {
      try {
        const { event } = eventView

        const headers = new Map<String, String>()
        
        event.webhookHeaders.forEach(webhookHeader => {
          const value = this.templateRenderer.render(webhookHeader.value, eventView)
          headers[webhookHeader.key] = value
        })

        const url = this.templateRenderer.render(event.webhookUrl, eventView)
        let body = null
        if (event.webhookBody) {
          body = this.templateRenderer.render(event.webhookBody, eventView)
        }
        debug('publishing ', url, body)
        await this.webhookJobPublisher.publish({
          headers,
          url,
          body
        })
      } catch (error) {
        rollbar.error(error)
        debug(error)
      }
    }))
  }
}