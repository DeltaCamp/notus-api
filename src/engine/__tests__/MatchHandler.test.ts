import { MatchHandler } from '../MatchHandler'
import { MatchContext } from '../MatchContext'

let eventId = 1;

describe('MatchHandler', () => {

  let matchHandler

  let eventService,
      actionContextsHandler

  beforeEach(() => {
    eventService = {
      deactivateEvent: jest.fn()
    }
    actionContextsHandler = {
      handle: jest.fn()
    }

    matchHandler = new MatchHandler(eventService, actionContextsHandler)
  })

  /// @return MatchContext
  function newContext(networkId, blockNumber) {
    return {
      network: {
        chainId: networkId,
        name: `network${networkId}`
      },
      block: {
        number: blockNumber
      }
    }
  }

  function newEvent() {
    return {
      id: eventId++
    }
  }

  describe('handle()', () => {

    let network1Block1, network1Block2
    let network2Block1, network2Block2
    let e1, e2

    beforeEach(() => {
      network1Block1 = newContext(1, 1)
      network1Block2 = newContext(1, 2)

      network2Block1 = newContext(2, 1)
      network2Block2 = newContext(2, 2)

      e1 = newEvent()
      e2 = newEvent()
    })

    it('should bundle events together', async () => {
      await matchHandler.startBlock(network1Block1.network, 1)
      await matchHandler.handle(network1Block1, e1)
      await matchHandler.handle(network1Block1, e2)
      await matchHandler.endBlock(network1Block1.network, 1)

      expect(actionContextsHandler.handle).toHaveBeenCalledTimes(1)

      expect(actionContextsHandler.handle).toHaveBeenCalledWith([
        { matchContext: network1Block1, event: e1 },
        { matchContext: network1Block1, event: e2 }
      ])
    })

    it('should separate different blocks', async () => {
      await matchHandler.startBlock(network1Block1.network, 1)
      await matchHandler.handle(network1Block1, e1)
      await matchHandler.startBlock(network1Block2.network, 2)
      await matchHandler.handle(network1Block2, e2)
      await matchHandler.endBlock(network1Block1.network, 1)

      expect(actionContextsHandler.handle).toHaveBeenCalledTimes(1)
      expect(actionContextsHandler.handle).toHaveBeenCalledWith([
        { matchContext: network1Block1, event: e1 }
      ])

      await matchHandler.endBlock(network1Block2.network, 2)
      expect(actionContextsHandler.handle).toHaveBeenCalledTimes(2)
      expect(actionContextsHandler.handle).toHaveBeenCalledWith([
        { matchContext: network1Block2, event: e2 }
      ])
    })

    it('should separate different networks', async () => {
      await matchHandler.startBlock(network1Block1.network, 1)
      await matchHandler.handle(network1Block1, e1)
      await matchHandler.startBlock(network2Block1.network, 1)
      await matchHandler.handle(network2Block1, e2)
      await matchHandler.endBlock(network1Block1.network, 1)

      expect(actionContextsHandler.handle).toHaveBeenCalledTimes(1)
      expect(actionContextsHandler.handle).toHaveBeenCalledWith([
        { matchContext: network1Block1, event: e1 }
      ])

      await matchHandler.endBlock(network2Block1.network, 1)
      expect(actionContextsHandler.handle).toHaveBeenCalledTimes(2)
      expect(actionContextsHandler.handle).toHaveBeenCalledWith([
        { matchContext: network2Block1, event: e2 }
      ])
    })
  })
})