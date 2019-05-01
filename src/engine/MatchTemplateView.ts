
import { Block, Log } from 'ethers/providers';
import { Network } from 'ethers/utils/networks';
import { Transaction } from '../engine/Transaction'
import { MatchContext } from '../engine/MatchContext'
import {
  EventEntity,
  MatcherEntity
} from '../entities'
import { formatEtherscanAddressUrl } from '../utils/formatEtherscanAddressUrl'
import { formatEtherscanTransactionUrl } from '../utils/formatEtherscanTransactionUrl'

export class MatchTemplateView {
  public readonly event?: EventEntity;
  public readonly block?: Block
  public readonly transaction?: Transaction
  public readonly log?: Log
  public readonly network?: Network

  constructor (
    context: MatchContext, event: EventEntity
  ) {
    this.event = event
    this.block = context.block
    this.transaction = context.transaction
    this.log = context.log
    this.network = context.network
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

  etherscanAddress  = () => {
    return this.formatEtherscanAddressUrl
  }

  etherscanTx  = () => {
    return this.formatEtherscanTransactionUrl
  }

  formatEtherscanAddressUrl = (text: string, render: (val: string) => string) => {
    return formatEtherscanAddressUrl(render(text), this.network.chainId)
  }

  formatEtherscanTransactionUrl = (text: string, render: (val: string) => string) => {
    return formatEtherscanTransactionUrl(render(text), this.network.chainId)
  }
}