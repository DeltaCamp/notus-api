import { Injectable } from '@nestjs/common'
import { Block, Log } from 'ethers/providers'

import { Matcher } from './Matcher'
import { MatchContext } from './MatchContext'
import { Transaction } from './Transaction'
import { EventEntity } from '../entities'
import { MatchHandler } from './MatchHandler'

const debug = require('debug')('notus:BlockHandler')

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
    debug(`Checking event`)
    event.eventType.eventTypeMatchers.forEach(eventTypeMatcher => {
      if (!this.matcher.matches(matchContext, eventTypeMatcher.matcher)) {
        debug(`Failing on `, eventTypeMatcher)
        failed = true
        return
      }
    })

    if (failed) { return }

    event.eventMatchers.forEach(eventMatcher => {
      if (!this.matcher.matches(matchContext, eventMatcher.matcher)) {
        debug(`Failing on `, eventMatcher)
        failed = true
        return
      }
    })

    if (failed) { return }

    this.matchHandler.handle(matchContext, event);
  }
}
