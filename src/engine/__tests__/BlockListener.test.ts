import { BlockListener } from '../BlockListener'

describe('BlockListener', () => {
  let blockListener

  let ethersProvider, workLogService, blockJobPublisher

  let provider, lastBlockNumber

  let oldBlockConfirmationLevel, oldCatchUpMaxBlocks

  beforeEach(() => {
    provider = {
      getNetwork: jest.fn(() => ({ name: 'homestead', chainId: 1 })),
      on: jest.fn(),
      removeListener: jest.fn()
    }

    ethersProvider = {
      getNetworkProvider: jest.fn(() => provider)
    }
    
    workLogService = {
      getLastBlock: jest.fn(() => lastBlockNumber),
      setLastBlock: jest.fn()
    }
    
    blockJobPublisher = {
      newBlock: jest.fn()
    }

    oldBlockConfirmationLevel = process.env.BLOCK_CONFIRMATION_LEVEL
    oldCatchUpMaxBlocks = process.env.MAX_REPLAY_BLOCKS

    blockListener = new BlockListener(ethersProvider, workLogService, blockJobPublisher)
  })

  afterEach(() => {
    process.env.BLOCK_CONFIRMATION_LEVEL = oldBlockConfirmationLevel
    process.env.MAX_REPLAY_BLOCKS = oldCatchUpMaxBlocks
  })

  describe('start()', () => {
    it('should bind the onBlock handlers', async () => {
      await blockListener.start('homestead')

      expect(blockListener.onBlocks['homestead']).toBeDefined()
    })

    it('should throw if a network already started', async () => {
      blockListener.start('homestead')
      let fail = false
      try {
        await blockListener.start('homestead')
      } catch (error) {
        fail = true
      }
      expect(fail).toBeTruthy()
    })
  })

  describe('onBlock()', () => {
    it('should process all blocks since the last one', async () => {
      await blockListener.start('homestead')

      process.env.BLOCK_CONFIRMATION_LEVEL = '0' // current block
      process.env.MAX_REPLAY_BLOCKS = '4' //
      
      lastBlockNumber = 2

      await blockListener.onBlocks['homestead'](4)

      expect(blockJobPublisher.newBlock).not.toHaveBeenCalledWith(
        expect.objectContaining({ blockNumber: 2 })
      )
      expect(blockJobPublisher.newBlock).toHaveBeenCalledWith(
        expect.objectContaining({ blockNumber: 3 })
      )
      expect(blockJobPublisher.newBlock).toHaveBeenCalledWith(
        expect.objectContaining({ blockNumber: 4, networkName: 'homestead', chainId: 1 })
      )

      expect(workLogService.setLastBlock).toHaveBeenCalledWith(1, 4)
    })

    it('should only process confirmed blocks', async () => {
      await blockListener.start('homestead')

      process.env.BLOCK_CONFIRMATION_LEVEL = '2'
      process.env.MAX_REPLAY_BLOCKS = '1'
      
      lastBlockNumber = 2

      await blockListener.onBlocks['homestead'](10)

      expect(blockJobPublisher.newBlock).not.toHaveBeenCalledWith(
        expect.objectContaining({ blockNumber: 6 })
      )
      expect(blockJobPublisher.newBlock).toHaveBeenCalledWith(
        expect.objectContaining({ blockNumber: 7 })
      )
      expect(blockJobPublisher.newBlock).toHaveBeenCalledWith(
        expect.objectContaining({ blockNumber: 8, networkName: 'homestead', chainId: 1 })
      )

      expect(workLogService.setLastBlock).toHaveBeenCalledWith(1, 8)
    })

    it('should not process more than max number of catch up blocks', async () => {

      await blockListener.start('homestead')

      process.env.BLOCK_CONFIRMATION_LEVEL = '0' // current block
      process.env.MAX_REPLAY_BLOCKS = '2' // process maximum the two previous blocks
      
      lastBlockNumber = 1

      await blockListener.onBlocks['homestead'](50)
      
      expect(blockJobPublisher.newBlock).not.toHaveBeenCalledWith(
        expect.objectContaining({ blockNumber: 47 })
      )
      expect(blockJobPublisher.newBlock).toHaveBeenCalledWith(
        expect.objectContaining({ blockNumber: 48 })
      )
      expect(blockJobPublisher.newBlock).toHaveBeenCalledWith(
        expect.objectContaining({ blockNumber: 49 })
      )
      expect(blockJobPublisher.newBlock).toHaveBeenCalledWith(
        expect.objectContaining({ blockNumber: 50 })
      )

      expect(workLogService.setLastBlock).toHaveBeenCalledWith(1, 50)
    })
  })
})