import { BlockListener } from '../BlockListener'
import { EventScope } from '../../events/EventScope';

describe('BlockListener', () => {
  let blockListener

  let provider, eventHandler, eventService

  let block, transactionResponse, transactionReceipt, blockEvents, transactionEvents, contractEventEvents

  beforeEach(() => {
    block = {
      transactions: [
        '0x1234'
      ]
    }
    transactionResponse = {}
    transactionReceipt = {
      logs: ['log']
    }

    provider = {
      on: jest.fn(),
      getBlock: jest.fn(() => Promise.resolve(block)),
      getTransaction: jest.fn(() => Promise.resolve(transactionResponse)),
      getTransactionReceipt: jest.fn(() => Promise.resolve(transactionReceipt))
    }

    eventHandler = {
      handle: jest.fn()
    }

    blockEvents = ['block']
    transactionEvents = ['transaction']
    contractEventEvents = ['contractEvent']

    eventService = {
      findByScope: jest.fn((eventScope) => {
        switch(eventScope) {
          case EventScope.BLOCK:
            return Promise.resolve(blockEvents)
          case EventScope.TRANSACTION:
            return Promise.resolve(transactionEvents)
          case EventScope.CONTRACT_EVENT:
            return Promise.resolve(contractEventEvents)
          default:
            throw new Error(`Unknown scope ${eventScope}`)
        }
      })
    }

    blockListener = new BlockListener(provider, eventHandler, eventService)
  })

  describe('onBlockNumber()', () => {
    it('should work', async () => {
      await blockListener.onBlockNumber('1')

      expect(eventService.findByScope).toHaveBeenCalledWith(EventScope.BLOCK)
      expect(eventService.findByScope).toHaveBeenCalledWith(EventScope.TRANSACTION)
      expect(eventService.findByScope).toHaveBeenCalledWith(EventScope.CONTRACT_EVENT)

      expect(provider.getBlock).toHaveBeenCalledWith(1)
      expect(provider.getTransaction).toHaveBeenCalledWith('0x1234')
      expect(provider.getTransactionReceipt).toHaveBeenCalledWith('0x1234')

      expect(eventHandler.handle).toHaveBeenCalledWith(blockEvents, block, undefined, undefined)
      expect(eventHandler.handle).toHaveBeenCalledWith(transactionEvents, block, expect.anything(), undefined)
      expect(eventHandler.handle).toHaveBeenCalledWith(contractEventEvents, block, expect.anything(), 'log')
    })
  })
})
