import { Injectable } from '@nestjs/common'

import { ActionContext } from './ActionContext'
import { EmailActionHandler } from './EmailActionHandler';
import { WebhookActionHandler } from './WebhookActionHandler';

const debug = require('debug')('notus:engine:ActionContextsHandler')

@Injectable()
export class ActionContextsHandler {

  constructor (
    private readonly emailActionHandler: EmailActionHandler,
    private readonly webhookActionHandler: WebhookActionHandler
  ) {}

  async handle(actionContexts: ActionContext[]) {
    // need to sort into users, 
    await this.webhookActionHandler.handle(actionContexts)

    debug(`handle(${actionContexts.length})`)

    const userActionContexts = this.groupActionContextsByUser(actionContexts)
    await Promise.all(Object.values(userActionContexts).map(async (actionContexts: ActionContext[]) => {
      await this.emailActionHandler.handle(actionContexts[0].event.user, actionContexts)
    }))
  }

  /**
   * Groups an array of ActionContext objects by the user id
   * @param actionContexts The batch of action contexts to fire
   */
  groupActionContextsByUser(actionContexts: ActionContext[]): Map<number, ActionContext[]> {
    return actionContexts.reduce(
      (userContexts: Map<number, ActionContext[]>, actionContext: ActionContext): Map<number, ActionContext[]> => {
        const userId = actionContext.event.user.id
        if (!userContexts[userId]) {
          userContexts[userId] = []
        }
        userContexts[userId].push(actionContext)
        return userContexts
      },
      new Map<number, ActionContext[]>()
    )
  }
}