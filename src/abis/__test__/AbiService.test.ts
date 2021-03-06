import { AbiService } from '../AbiService'
import { AbiDto } from '../AbiDto'

const TRANSFER_EVENT = {
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "name": "from",
      "type": "address"
    },
    {
      "indexed": true,
      "name": "to",
      "type": "address"
    },
    {
      "indexed": false,
      "name": "value",
      "type": "uint256"
    }
  ],
  "name": "Transfer",
  "type": "event"
}

const cDAI = require('./cdai_abi.json')
const Pool = require('./pool_abi.json')
const MoneyMarket = require('./money-market_abi.json')

describe('AbiService', () => {
  let service

  let connection, manager, abiEventService

  beforeEach(() => {
    manager = {
      save: jest.fn()
    }

    connection = {
      manager,
      transaction: jest.fn((callback) => callback(manager))
    }

    abiEventService = {
      create: jest.fn(() => ({ topic: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' }))
    }

    service = new AbiService(connection, abiEventService)
  })

  function newDto(abiObject: Object): AbiDto {
    return {
      name: 'MakeDAO',
      abi: JSON.stringify(abiObject),
      isPublic: true
    }
  }

  describe('createAbi', () => {
    it('should load a JSON abi', async () => {
      const abi = await service.createAbi(newDto([
        TRANSFER_EVENT
      ]))

      expect(abi.name).toEqual('MakeDAO')
      expect(abi.abiEvents.length).toEqual(1)
      const abiEvent = abi.abiEvents[0]
  
      expect(abiEvent.topic).toEqual('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef')
    })
  })

  it('should load the cDAI abi', async () => {
    const abi = await service.createAbi(newDto(cDAI))
    expect(abi.abiEvents.length).toEqual(15)
  })

  it('should load the Pool abi', async () => {
    const abi = await service.createAbi(newDto(Pool))
    expect(abi.abiEvents.length).toEqual(6)
  })

  it('should load the MoneyMarket abi', async () => {
    const abi = await service.createAbi(newDto(MoneyMarket))
    expect(abi.abiEvents.length).toEqual(0)
  })
})