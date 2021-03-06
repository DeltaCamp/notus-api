import { Injectable } from '@nestjs/common';
import { Network } from 'ethers/utils/networks';

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
  private actionContextBuffers: Map<number, Map<number, ActionContext[]>>;

  constructor (
    private readonly eventService: EventService,
    private readonly actionContextsHandler: ActionContextsHandler
  ) {
    this.actionContextBuffers = new Map<number, Map<number, ActionContext[]>>()
  }

  async handle(matchContext: MatchContext, event: EventEntity) {
     // in case an event was previously deactivated, just bounce
    if (event.runCount === 0) { return false }
    this.addActionContext(matchContext, event)
    if (event.runCount > 0) {
      await this.eventService.decrementRunCount(event)
    }
    return true
  }

  async startBlock(network: Network, blockNumber: number) {
    debug(`startBlock with chainId/number: ${network.chainId} ${blockNumber}`)
    if (!this.actionContextBuffers[network.chainId]) {
      this.actionContextBuffers[network.chainId] = new Map<number, ActionContext[]>()
    }
    this.actionContextBuffers[network.chainId][blockNumber] = []
  }

  async endBlock(network: Network, blockNumber: number) {
    const buffer = this.actionContextBuffers[network.chainId][blockNumber]
    debug(`endBlock with chainId/number/num events: ${network.chainId} ${blockNumber} ${buffer ? buffer.length : 'null'}`)
    if (buffer && buffer.length > 0) {
      await this.actionContextsHandler.handle(buffer)
    }
    delete this.actionContextBuffers[network.chainId][blockNumber]
  }

  addActionContext(matchContext: MatchContext, event: EventEntity) {
    const { block, network } = matchContext
    debug(`addActionContext with chainId/number: ${network.chainId} ${block.number} for event id ${event.id}`)
    this.actionContextBuffers[network.chainId][block.number].push(new ActionContext(matchContext, event))
  }
}
