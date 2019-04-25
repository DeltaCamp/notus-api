import { BlockHandler } from '../BlockHandler'
import { EventScope } from '../../events/EventScope';

describe('BlockHandler', () => {
  let blockListener

  let provider, eventHandler, eventService

  let block, transactionResponse, transactionReceipt, blockEvents, transactionEvents, abiEventEvents, network, ethersProvider

  beforeEach(() => {
    block = {
      transactions: [
        '0x1234'
      ]
    }
    network = {
      name: 'homestead',
      chainId: 1
    }
    transactionResponse = {}
    transactionReceipt = {
      logs: ['log']
    }

    provider = {
      on: jest.fn(),
      getNetwork: jest.fn(() => Promise.resolve(network)),
      getBlock: jest.fn(() => Promise.resolve(block)),
      getTransaction: jest.fn(() => Promise.resolve(transactionResponse)),
      getTransactionReceipt: jest.fn(() => Promise.resolve(transactionReceipt))
    }

    eventHandler = {
      match: jest.fn()
    }

    blockEvents = ['block']
    transactionEvents = ['transaction']
    abiEventEvents = ['abiEvent']

    eventService = {
      findByScope: jest.fn((eventScope) => {
        switch(eventScope) {
          case EventScope.BLOCK:
            return Promise.resolve(blockEvents)
          case EventScope.TRANSACTION:
            return Promise.resolve(transactionEvents)
          case EventScope.CONTRACT_EVENT:
            return Promise.resolve(abiEventEvents)
          default:
            throw new Error(`Unknown scope ${eventScope}`)
        }
      })
    }

    ethersProvider = {
      getNetworkProvider: jest.fn(() => provider)
    }

    blockListener = new BlockHandler(ethersProvider, eventHandler, eventService)
  })

  describe('onBlockNumber()', () => {
    it('should work', async () => {
      await blockListener.handle(network.name, 10)

      expect(ethersProvider.getNetworkProvider).toHaveBeenCalledWith('homestead')

      expect(eventService.findByScope).toHaveBeenCalledWith(EventScope.BLOCK)
      expect(eventService.findByScope).toHaveBeenCalledWith(EventScope.TRANSACTION)
      expect(eventService.findByScope).toHaveBeenCalledWith(EventScope.CONTRACT_EVENT)

      expect(provider.getBlock).toHaveBeenCalledWith(10)
      expect(provider.getTransaction).toHaveBeenCalledWith('0x1234')
      expect(provider.getTransactionReceipt).toHaveBeenCalledWith('0x1234')

      expect(eventHandler.match).toHaveBeenCalledWith(blockEvents, network, block, undefined, undefined)
      expect(eventHandler.match).toHaveBeenCalledWith(transactionEvents, network, block, expect.anything(), undefined)
      expect(eventHandler.match).toHaveBeenCalledWith(abiEventEvents, network, block, expect.anything(), 'log')
    })
  })
})
