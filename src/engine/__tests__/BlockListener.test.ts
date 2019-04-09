import { BlockListener } from '../BlockListener'

describe('BlockListener', () => {
  let blockListener

  let provider, blockHandler, eventService

  let block, transactionResponse, transactionReceipt, events

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

    blockHandler = {
      handleBlock: jest.fn()
    }

    events = ['event']

    eventService = {
      findAllForMatch: jest.fn(() => Promise.resolve(events))
    }

    blockListener = new BlockListener(provider, blockHandler, eventService)
  })

  describe('onBlockNumber()', () => {
    it('should work', async () => {
      await blockListener.onBlockNumber('1')

      expect(eventService.findAllForMatch).toHaveBeenCalledTimes(1)

      expect(provider.getBlock).toHaveBeenCalledWith(1)
      expect(provider.getTransaction).toHaveBeenCalledWith('0x1234')
      expect(provider.getTransactionReceipt).toHaveBeenCalledWith('0x1234')

      expect(blockHandler.handleBlock).toHaveBeenCalledWith(events, block, expect.anything(), 'log')
    })
  })
})
