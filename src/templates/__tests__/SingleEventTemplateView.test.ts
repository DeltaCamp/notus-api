import { bigNumberify } from 'ethers/utils'
import { SingleEventTemplateView } from '../SingleEventTemplateView'
import { MatchContext } from '../../engine/MatchContext';
import {
  EventEntity
} from '../../entities';

const Mustache = require('mustache')

describe('SingleEventTemplateView', () => {
  let view: SingleEventTemplateView

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
    view = new SingleEventTemplateView(context, event)
  })

  it('should render an etherscan addres url', () => {
    expect(Mustache.render(
      "{{#etherscanAddress}}{{transaction.from}}{{/etherscanAddress}}",
      view
    )).toContain('https://etherscan.io/address/0xDe2279Ca2A4f408006EFaB5f2c35aBbFC458C4b4')
  })

  it('should render an etherscan transaction url', () => {
    expect(Mustache.render(
      "{{#etherscanTx}}{{transaction.hash}}{{/etherscanTx}}",
      view
    )).toContain('https://etherscan.io/tx/0x0afd071dca071b824924d3c61a6b95ca8e576eb32330bfbbbe634b97a1644caf')
  })

  it('should render a tx url correctly for ropsten', () => {
    network.chainId = 3
    expect(Mustache.render(
      "{{#etherscanTx}}{{transaction.hash}}{{/etherscanTx}}",
      view
    )).toContain('https://ropsten.etherscan.io/tx/0x0afd071dca071b824924d3c61a6b95ca8e576eb32330bfbbbe634b97a1644caf')
  })

  it('should render big numbers correctly', () => {
    expect(Mustache.render(
      "{{transaction.value}}",
      view
    )).toContain('1000')
  })
})