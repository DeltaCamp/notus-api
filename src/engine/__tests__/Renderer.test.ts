import { bigNumberify } from 'ethers/utils'
import { Renderer } from '../Renderer'
import { MatchContext } from '../MatchContext';
import {
  EventEntity
} from '../../entities';

describe('Renderer', () => {
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

  it('should render an etherscan addres url', () => {
    expect(renderer.render(
      "{{#etherscanAddress}}{{transaction.from}}{{/etherscanAddress}}",
      context, event
    )).toContain('https://etherscan.io/address/0xDe2279Ca2A4f408006EFaB5f2c35aBbFC458C4b4')
  })

  it('should render an etherscan transaction url', () => {
    expect(renderer.render(
      "{{#etherscanTx}}{{transaction.hash}}{{/etherscanTx}}",
      context, event
    )).toContain('https://etherscan.io/tx/0x0afd071dca071b824924d3c61a6b95ca8e576eb32330bfbbbe634b97a1644caf')
  })

  it('should render a tx url correctly for ropsten', () => {
    network.chainId = 3
    expect(renderer.render(
      "{{#etherscanTx}}{{transaction.hash}}{{/etherscanTx}}",
      context, event
    )).toContain('https://ropsten.etherscan.io/tx/0x0afd071dca071b824924d3c61a6b95ca8e576eb32330bfbbbe634b97a1644caf')
  })

  it('should render big numbers correctly', () => {
    expect(renderer.render(
      "{{transaction.value}}",
      context, event
    )).toContain('1000')
  })
})