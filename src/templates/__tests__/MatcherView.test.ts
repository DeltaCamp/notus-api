import { MatcherView } from '../MatcherView'
import {
  AbiEventEntity,
  AbiEntity,
  AbiEventInputEntity,
  MatcherEntity
} from '../../entities';
import * as Source from '../../matchers/Source'
import { Operator } from '../../matchers/Operator'
import { SolidityDataType } from '../../common/SolidityDataType';

describe('MatcherView', () => {
  describe('description()', () => {
    it('should correctly format standard sources', () => {
      let matcher1 = new MatcherEntity()

      matcher1.source = Source.TRANSACTION_FROM
      matcher1.operator = Operator.EQ
      matcher1.operand = '0x4321'

      let matcher = new MatcherView(matcher1, true, true)

      expect(matcher.description()).toContain(`transaction from address is equal to 0x4321`)
    })

    it('should correctly format custom abi event inputs', () => {
      const abiEventInput = new AbiEventInputEntity()
      abiEventInput.name = 'value'
      abiEventInput.type = SolidityDataType.UINT256

      const abiEvent = new AbiEventEntity()
      abiEvent.name = 'transfer'
      abiEvent.abiEventInputs = [abiEventInput]

      const abi = new AbiEntity()
      abi.name = 'ERC20'

      abiEvent.abi = abi
      abiEventInput.abiEvent = abiEvent

      let matcher2 = new MatcherEntity()

      matcher2.source = Source.CONTRACT_EVENT_INPUT
      matcher2.abiEventInput = abiEventInput
      matcher2.operator = Operator.GT
      matcher2.operand = '1000'

      let matcher = new MatcherView(matcher2, true, true)

      expect(matcher.description()).toContain(`transfer value is greater than 1000`)
    })  
  })
})