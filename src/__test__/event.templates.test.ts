import { bigNumberify } from 'ethers/utils'

import { Renderer } from '../engine/Renderer'
import { MatchContext } from '../engine/MatchContext';
import {
  EventEntity,
  AbiEventEntity,
  AbiEntity,
  AbiEventInputEntity,
  MatcherEntity
} from '../entities';
import * as Source from '../matchers/Source'
import { Operator } from '../matchers/Operator'
import { EventScope } from '../events/EventScope'
import { SolidityDataType } from '../common/SolidityDataType';

const fs = require('fs')

describe('Event templates', () => {
  let renderer: Renderer

  let context
  let event: EventEntity

  let block, transaction, log, network

  beforeEach(() => {
    block = {
      number: 1234,
      difficulty: 999,
      hash: '0x1234',
      timestamp: new Date(),
      nonce: 42,
      parentHash: '0x4321'
    }
    transaction = {
      hash: '0x0afd071dca071b824924d3c61a6b95ca8e576eb32330bfbbbe634b97a1644caf',
      from: '0xDe2279Ca2A4f408006EFaB5f2c35aBbFC458C4b4',
      value: bigNumberify('1000')
    }
    log = {}
    network = {
      chainId: 1
    }
    context = new MatchContext(
      block, transaction, log, network
    )
    event = new EventEntity()
    renderer = new Renderer()
  })

  it('should render the html event template correctly', () => {
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

    event.scope = EventScope.CONTRACT_EVENT
    event.abiEvent = abiEvent

    let matcher1 = new MatcherEntity()
    let matcher2 = new MatcherEntity()

    matcher1.source = Source.TRANSACTION_FROM
    matcher1.operator = Operator.EQ
    matcher1.operand = '0x4321'

    matcher2.source = Source.CONTRACT_EVENT_INPUT
    matcher2.abiEventInput = abiEventInput
    matcher2.operator = Operator.GT
    matcher2.operand = '1000'

    event.matchers = [matcher1, matcher2]

    let htmlTemplate = fs.readFileSync(__dirname + '/../../templates/event.template.html.mst', { encoding: 'utf8' })
    let result = renderer.render(htmlTemplate, context, event)
    
    expect(result).toContain(`ERC20 transfer occurred at block 1234`)
    expect(result).toContain(`where transaction from address is equal to 0x4321 and`)
    expect(result).toContain(`transfer value is greater than 1000`)
  })
})