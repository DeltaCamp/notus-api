import { BaseHandler } from '../BaseHandler'
import { EventScope } from '../../events/EventScope'
import {
  EventEntity,
  MatcherEntity,
  AbiEventEntity
} from '../../entities'

describe('BaseHandler', () => {
  let baseHandler

  let events, matchHandler, matcher
  let block, transaction, log

  let event
  let matcher1, matcher2

  beforeEach(() => {
    matcher1 = new MatcherEntity()
    matcher2 = new MatcherEntity()

    event = new EventEntity()
    event.matchers = [matcher1, matcher2]

    events = [event]

    matchHandler = {
      handle: jest.fn()
    }

    matcher = {
      matches: jest.fn(() => false)
    }

    block = {}
    transaction = {}
    log = {}

    baseHandler = new BaseHandler(matchHandler, matcher)
  })

  describe('handleEvent()', () => {
    it('should exit if the abiEvent does not match', async () => {
      // Set so that all matchers are successful
      matcher.matches = jest.fn(() => true)
      event.scope = EventScope.CONTRACT_EVENT
      event.abiEvent = new AbiEventEntity()
      event.abiEvent.topic = '0x1234'
      log = {
        topics: [
          '0x9999'
        ]
      }
      await baseHandler.handle(events, block, transaction, log)
      expect(matchHandler.handle).not.toHaveBeenCalled()
    })

    xit('should not call the match handler if a matcher fails', async () => {
      await baseHandler.handle(events, block, transaction, log)
      expect(matchHandler.handle).not.toHaveBeenCalled()
    })

    xit('should call the matcher when all matchers pass', async () => {
      matcher.matches = jest.fn(() => true)
      await baseHandler.handle(events, block, transaction, log)
      expect(matchHandler.handle).toHaveBeenCalled()
    })
  })
})
