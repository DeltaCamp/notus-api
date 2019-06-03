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

describe('AbiService', () => {
  let service

  let emp

  beforeEach(() => {
    emp = {
      get: jest.fn()
    }

    service = new AbiService(emp)
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

  describe('cDAI', () => {
    it('should load the cDAI abi', async () => {
      const abi = await service.createAbi(newDto(cDAI))
      expect(abi.abiEvents.length).toEqual(15)
    })
  })
})