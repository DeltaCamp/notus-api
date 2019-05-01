import { Injectable } from '@nestjs/common'

import { ActionContext } from './ActionContext'
import { UserActionContextsHandler } from './UserActionContextsHandler';

const debug = require('debug')('notus:engine:ActionContextsHandler')

@Injectable()
export class ActionContextsHandler {

  constructor (
    private readonly userActionContextsHandler: UserActionContextsHandler,
  ) {}

  async handle(actionContexts: ActionContext[]) {
    // need to sort into users, 
    const userActionContexts = this.groupActionContextsByUser(actionContexts)
    await Promise.all(Object.values(userActionContexts).map(async (actionContexts: ActionContext[]) => {
      await this.userActionContextsHandler.handle(actionContexts[0].event.user, actionContexts)
    }))
  }

  /**
   * Groups an array of ActionContext objects by the user id
   * @param actionContexts The batch of action contexts to fire
   */
  groupActionContextsByUser(actionContexts: ActionContext[]): Map<number, ActionContext[]> {
    return actionContexts.reduce(
      (userContexts: Map<number, ActionContext[]>, actionContext: ActionContext): Map<number, ActionContext[]> => {
        debug(actionContext.event)
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