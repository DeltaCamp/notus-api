import { Injectable } from '@nestjs/common';
import { Block, Log } from 'ethers/providers'
import { Network, getAddress } from 'ethers/utils';

import { rollbar } from '../rollbar'
import { EventScope } from '../events/EventScope'
import { Transaction } from './Transaction'
import { Matcher } from './Matcher'
import { MatchContext } from './MatchContext'
import { MatchHandler } from './MatchHandler'
import {
  EventEntity,
  MatcherEntity
} from '../entities'

const debug = require('debug')('notus:engine:EventsMatcher')

@Injectable()
export class EventsMatcher {

  constructor (
    protected readonly matchHandler: MatchHandler,
    protected readonly matcher: Matcher
  ) {}

  match(events: EventEntity[], network: Network, block: Block, transaction: Transaction, log: Log) {
    this.matchEvents(new MatchContext(block, transaction, log, network), events)
  }

  matchEvents(matchContext: MatchContext, events: EventEntity[]) {
    events.forEach(event => {
      const context = matchContext.clone()
      try {
        if (this.matches(context, event)) {
          this.matchHandler.handle(context, event);
        }
      } catch(error) {
        rollbar.error(`Error processing event ${event.id}: ${error.message}`, error)
      }
    })
  }

  matches(matchContext: MatchContext, event: EventEntity) {
    let i: number;
    debug(`Checking event ${event.id}`, event.scope)

    if (this.abiEventScopeDoesNotMatch(matchContext, event)) {
      debug(`abiEventScopeDoesNotMatch for event ${event.id}`)
      return false
    }

    if (this.contractDoesNotMatch(matchContext, event)) {
      debug(`contractDoesNotMatch for event ${event.id}`)
      return false
    }

    if (!this.matchersSucceed(matchContext, event)) {
      debug(`matchers failed for event ${event.id}`)
      return false
    }

    return true
  }

  abiEventScopeDoesNotMatch(matchContext: MatchContext, event: EventEntity): boolean {
    return event.scope === EventScope.CONTRACT_EVENT && matchContext.log.topics[0] !== event.abiEvent.topic
  }

  contractDoesNotMatch(matchContext: MatchContext, event: EventEntity): boolean {
    if (!event.contract) { return false }
    if (!matchContext.transaction) { return false }
    return getAddress(matchContext.transaction.to) !== getAddress(event.contract.address)
  }

  matchersSucceed(matchContext: MatchContext, event: EventEntity): Boolean {
    if (event.matchers.length === 0) { return false }

    let i: number;
    let matcher: MatcherEntity
    for (i = 0; i < event.matchers.length; i++) {
      matcher = event.matchers[i]
      if (!this.matcher.matches(matchContext, matcher)) {
        return false
      }
    }
    return true
  }
}