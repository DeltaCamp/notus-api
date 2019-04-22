import { Block, Log } from 'ethers/providers';
import { Network } from 'ethers/utils/networks';
import { Transaction } from './Transaction'
import { MatchContext } from './MatchContext'
import {
  EventEntity,
  MatcherEntity
} from '../entities'
import { formatEtherscanAddressUrl } from '../utils/formatEtherscanAddressUrl'
import { formatEtherscanTransactionUrl } from '../utils/formatEtherscanTransactionUrl'

const Mustache = require('mustache')

export class Renderer {
  private context: MatchContext;
  private event?: EventEntity;

  render (template: string, context: MatchContext, event: EventEntity): string {
    this.context = context;
    this.event = event;
    return Mustache.render(template, {
      ...context,
      event,
      title: this.title,
      matchers: this.matchers,
      etherscanAddress: this.etherscanAddressFactory,
      etherscanTx: this.etherscanTxFactory
    })
  }

  title () {
    return this.event.formatTitle()
  }

  matchers () {
    return this.event.matchers.map((matcher: MatcherEntity, index) => ({
      description: matcher.description(),
      isFirst: index === 0,
      isLast: index === (this.event.matchers.length - 1)
    }))
  }

  etherscanAddressFactory = () => {
    return this.etherscanAddress  
  }

  etherscanTxFactory = () => {
    return this.etherscanTx
  }

  etherscanAddress = (text: string, render: (val: string) => string) => {
    return formatEtherscanAddressUrl(render(text), this.context.network.chainId)
  }

  etherscanTx = (text: string, render: (val: string) => string) => {
    return formatEtherscanTransactionUrl(render(text), this.context.network.chainId)
  }
}