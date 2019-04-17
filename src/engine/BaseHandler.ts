import { Block, Log } from 'ethers/providers'

import { EventScope } from '../events/EventScope'
import { Transaction } from './Transaction'
import { Matcher } from './Matcher'
import { MatchContext } from './MatchContext'
import { MatchHandler } from './MatchHandler'
import {
  EventEntity,
  MatcherEntity
} from '../entities'

export class BaseHandler {

  constructor (
    protected readonly matchHandler: MatchHandler,
    protected readonly matcher: Matcher
  ) {}

  handle(events: EventEntity[], block: Block, transaction: Transaction, log: Log) {
    this.handleEvents(new MatchContext(block, transaction, log), events)
  }

  handleEvents(matchContext: MatchContext, events: EventEntity[]) {
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
      (event.parent && this.contractEventScopeDoesNotMatch(matchContext, event.parent)) ||
      this.contractEventScopeDoesNotMatch(matchContext, event)
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

  contractEventScopeDoesNotMatch(matchContext: MatchContext, event: EventEntity): boolean {
    return event.scope === EventScope.CONTRACT_EVENT && matchContext.log.topics[0] !== event.contractEvent.topic
  }

  matchersSucceed(matchContext: MatchContext, event: EventEntity): Boolean {
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