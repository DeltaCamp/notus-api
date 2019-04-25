import { Injectable } from '@nestjs/common';
import { Block, Log } from 'ethers/providers'
import { Network } from 'ethers/utils';

import { EventScope } from '../events/EventScope'
import { Transaction } from './Transaction'
import { Matcher } from './Matcher'
import { MatchContext } from './MatchContext'
import { MatchHandler } from './MatchHandler'
import {
  EventEntity,
  MatcherEntity
} from '../entities'

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
      if (this.matches(context, event)) {
        this.matchHandler.handle(context, event);
      }
    })
  }

  matches(matchContext: MatchContext, event: EventEntity) {
    let i: number;

    if (
      (event.parent && this.abiEventScopeDoesNotMatch(matchContext, event.parent)) ||
      this.abiEventScopeDoesNotMatch(matchContext, event)
    ) {
      return false
    }

    if (event.parent && !this.matchersSucceed(matchContext, event.parent)) {
      return false
    }

    if (!this.matchersSucceed(matchContext, event)) {
      return false
    }

    return true
  }

  abiEventScopeDoesNotMatch(matchContext: MatchContext, event: EventEntity): boolean {
    return event.scope === EventScope.CONTRACT_EVENT && matchContext.log.topics[0] !== event.abiEvent.topic
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