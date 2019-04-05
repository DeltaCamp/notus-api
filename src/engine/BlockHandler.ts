import { Injectable } from '@nestjs/common'
import { Block, Log } from 'ethers/providers'

import { Matcher } from './Matcher'
import { MatchContext } from './MatchContext'
import { Transaction } from './Transaction'
import { EventEntity } from '../events'
import { MatchHandler } from './MatchHandler'

@Injectable()
export class BlockHandler {

  constructor (
    private readonly matchHandler: MatchHandler,
    private readonly matcher: Matcher
  ) {}

  async handleBlock(events: EventEntity[], block: Block, transaction: Transaction, log: Log): Promise<void> {
    const matchContext = new MatchContext(block, transaction, log)
    await Promise.all(events.map(event => (
      this.checkEvent(matchContext, event)
    )))
  }

  async checkEvent(matchContext: MatchContext, event: EventEntity) {
    let failed = false

    event.eventType.eventTypeMatchers.forEach(eventTypeMatcher => {
      if (!this.matcher.matches(matchContext, eventTypeMatcher.matcher)) {
        failed = true
        return
      }
    })

    if (failed) { return }

    event.eventMatchers.forEach(eventMatcher => {
      if (!this.matcher.matches(matchContext, eventMatcher.matcher)) {
        failed = true
        return
      }
    })

    if (failed) { return }

    this.matchHandler.handle(matchContext, event);
  }
}
