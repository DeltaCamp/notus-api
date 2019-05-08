import { Block, Log } from 'ethers/providers';
import { Network } from 'ethers/utils/networks';

import { Transaction } from '../engine/Transaction'
import { BaseTemplateView } from '../templates/BaseTemplateView'
import { MatchContext } from '../engine/MatchContext'
import {
  EventEntity,
  MatcherEntity
} from '../entities'
import { formatEtherscanAddressUrl } from '../utils/formatEtherscanAddressUrl'
import { formatEtherscanTransactionUrl } from '../utils/formatEtherscanTransactionUrl'
import { BlockView } from './BlockView'
import { TransactionView } from './TransactionView'
import { AbiEventView } from './AbiEventView';
import { MatcherView } from './MatcherView';

export class SingleEventTemplateView extends BaseTemplateView {
  public readonly event?: EventEntity;
  public readonly block?: BlockView
  public readonly transaction?: TransactionView
  public readonly log?: Log
  public readonly network?: Network
  public readonly matchers: MatcherView[]

  constructor (
    context: MatchContext, event: EventEntity
  ) {
    super()
    this.event = event
    this.block = new BlockView(context.block)
    this.transaction = new TransactionView(context.transaction)
    this.log = context.log
    this.network = context.network

    const logDescriptions = Object.values(context.event)
    if (logDescriptions.length) {
      const abiEventView = new AbiEventView(logDescriptions[0], event.matchers)
      this[abiEventView.name] = abiEventView
    }

    this.matchers = (event.matchers || []).map((matcher, index) => (
      new MatcherView(matcher, index === 0, index === (this.event.matchers.length - 1), context)
    ))
  }

  disableEventUrl = () => {
    return `${this.notusNetworkUri()}/disable-email?disableEmailKey=${this.event.disableEmailKey}`
  }

  title = () => {
    return this.event.formatTitle()
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