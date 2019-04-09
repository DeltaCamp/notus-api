import { BlockHandler } from '../BlockHandler'

import {
  EventEntity,
  EventTypeEntity,
  EventTypeMatcherEntity,
  EventMatcherEntity,
  MatcherEntity
} from '../../entities'

describe('BlockHandler', () => {
  let blockHandler

  let events, matchHandler, matcher
  let block, transaction, log

  let event, eventType, eventTypeMatcher, eventMatcher
  let matcher1, matcher2

  beforeEach(() => {
    matcher1 = new MatcherEntity()
    matcher2 = new MatcherEntity()
    eventTypeMatcher = new EventTypeMatcherEntity()
    eventTypeMatcher.matcher = matcher1

    eventMatcher = new EventMatcherEntity()
    eventMatcher.matcher = matcher2

    event = new EventEntity()
    eventType = new EventTypeEntity()
    eventType.eventTypeMatchers = [eventTypeMatcher]
    event.eventType = eventType
    event.eventMatchers = [eventMatcher]

    events = [event]

    matchHandler = {
      handle: jest.fn()
    }

    matcher = {
      matches: jest.fn()
    }

    block = {}
    transaction = {}
    log = {}

    blockHandler = new BlockHandler(matchHandler, matcher)
  })

  describe('handleBlock()', () => {
    it('should not call the match handler if a matcher fails', async () => {
      await blockHandler.handleBlock(events, block, transaction, log)
      expect(matchHandler.handle).not.toHaveBeenCalled()
    })

    it('should call the matcher when all matchers pass', async () => {
      matcher.matches = jest.fn(() => true)
      await blockHandler.handleBlock(events, block, transaction, log)
      expect(matchHandler.handle).toHaveBeenCalled()
    })
  })
})
