import { EventsMatcher } from '../EventsMatcher'
import { EventScope } from '../../events/EventScope'
import {
  EventEntity,
  MatcherEntity,
  AbiEventEntity
} from '../../entities'

describe('EventsMatcher', () => {
  let eventsMatcher

  let events, matchHandler, matcher
  let block, transaction, log, network

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
    network = {}

    eventsMatcher = new EventsMatcher(matchHandler, matcher)
  })

  describe('handleEvent()', () => {
    it('should return false if the event contract is defined and does not match', () => {
      event.contract = {
        address: '0xDf9DCa14E092998b2b246486D935A20b3A5749BE'
      }
      transaction.to = '0x9eA4826Ba5d0C2019f640CE9Bf08D5aB5870c8fa'
      matcher.matches = jest.fn(() => true)

      eventsMatcher.match([event], network, block, transaction, log)
      expect(matchHandler.handle).not.toHaveBeenCalled()
    })

    it('should exit if the abiEvent does not match', () => {
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
      eventsMatcher.match(events, network, block, transaction, log)
      expect(matchHandler.handle).not.toHaveBeenCalled()
    })

    it('should not call the match handler if a matcher fails', () => {
      eventsMatcher.match(events, network, block, transaction, log)
      expect(matchHandler.handle).not.toHaveBeenCalled()
    })

    it('should call the matcher when all matchers pass', () => {
      matcher.matches = jest.fn(() => true)
      eventsMatcher.match(events, network, block, transaction, log)
      expect(matchHandler.handle).toHaveBeenCalled()
    })
  })
})
