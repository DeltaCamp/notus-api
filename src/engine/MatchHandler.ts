import { Injectable } from '@nestjs/common';

import { MatchContext } from './MatchContext'
import {
  EventEntity
} from '../entities'
import { ActionContext } from './ActionContext'
import { EventService } from '../events/EventService'
import { ActionContextsHandler } from './ActionContextsHandler';

const debug = require('debug')('notus:engine:MatchHandler')

@Injectable()
export class MatchHandler {
  private actionContextBuffers: Map<number, ActionContext[]>;

  constructor (
    private readonly eventService: EventService,
    private readonly actionContextsHandler: ActionContextsHandler
  ) {
    this.actionContextBuffers = new Map<number, ActionContext[]>()
  }

  async handle(matchContext: MatchContext, event: EventEntity) {
     // in case an event was previously deactivated, just bounce
    if (!event.isActive) { return false }
    this.addActionContext(matchContext.block.number, new ActionContext(matchContext, event))
    if (event.runCount !== -1) { //once the event is fired, deactivate it
      await this.eventService.deactivateEvent(event)
    }
    return true
  }

  async startBlock(blockNumber: number) {
    this.actionContextBuffers[blockNumber] = []
  }

  async endBlock(blockNumber: number) {
    await this.actionContextsHandler.handle(this.actionContextBuffers[blockNumber])
    delete this.actionContextBuffers[blockNumber]
  }

  addActionContext(blockNumber: number, actionContext: ActionContext) {
    this.actionContextBuffers[blockNumber].push(actionContext)
  }
}
