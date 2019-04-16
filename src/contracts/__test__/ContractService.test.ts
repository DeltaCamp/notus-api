import { ContractService } from '../ContractService'
import { ContractDto } from '../ContractDto'
import { transactionContextRunner } from '../../transactions'

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

describe('ContractService', () => {
  let service

  let emp

  beforeEach(() => {
    emp = {
      get: jest.fn()
    }

    service = new ContractService(emp)
  })

  function newDto(abiObject: Object): ContractDto {
    return {
      address: '0x1234',
      name: 'MakeDAO',
      abi: JSON.stringify(abiObject)
    }
  }

  describe('createContract', () => {
    it('should load a JSON abi', async () => {
      const contract = await service.createContract(newDto([
        TRANSFER_EVENT
      ]))

      expect(contract.name).toEqual('MakeDAO')
      expect(contract.address).toEqual('0x1234')
      expect(contract.contractEvents.length).toEqual(1)
      const contractEvent = contract.contractEvents[0]
  
      expect(contractEvent.topic).toEqual('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef')
    })
  })
  
})