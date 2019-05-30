import { Injectable } from '@nestjs/common';
import { Block, Log, TransactionResponse, TransactionReceipt, BaseProvider } from 'ethers/providers'

import { EventScope } from '../events/EventScope'
import { EventsMatcher } from './EventsMatcher'
import { createTransaction } from './createTransaction'
import { Transaction } from './Transaction'
import { EventEntity } from '../entities'
import { EventService } from '../events/EventService'
import { Network } from 'ethers/utils';
import { EthersProvider } from './EthersProvider';
import { MatchHandler } from './MatchHandler'
import { useLocalhostNotMainnet } from '../utils/useLocalhostNotMainnet';

const debug = require('debug')('notus:engine:BlockHandler')

@Injectable()
export class BlockHandler {
  constructor (
    private readonly ethersProvider: EthersProvider,
    private readonly eventsMatcher: EventsMatcher,
    private readonly eventService: EventService,
    protected readonly matchHandler: MatchHandler,
  ) {}

  handle = async (networkName: string, blockNumber: number): Promise<any> => {
    const provider = this.ethersProvider.getNetworkProvider(networkName)
    const network = await provider.getNetwork()
    // Hack so that mainnet contracts and events work on localhost
    if (networkName === 'unknown' && useLocalhostNotMainnet()) {
      network.chainId = 1
    }
    await this.checkBlockNumber(provider, network, blockNumber)
  }

  checkBlockNumber = async (provider: BaseProvider, network: Network, blockNumber: number) => {
    const blockEvents = await this.eventService.findByScope(EventScope.BLOCK, network.chainId)
    const transactionEvents = await this.eventService.findByScope(EventScope.TRANSACTION, network.chainId)
    const abiEventEvents = await this.eventService.findByScope(EventScope.CONTRACT_EVENT, network.chainId)
    const block: Block = await provider.getBlock(blockNumber)
    await this.matchHandler.startBlock(network, blockNumber)
    debug(`checkBlockNumber ${blockNumber} for chain id ${network.chainId}: [block, transaction, log] [${blockEvents.length}, ${transactionEvents.length}, ${abiEventEvents.length}]`)
    if (blockEvents.length) {
      await this.eventsMatcher.match(blockEvents, network, block, undefined, undefined)
    }
    await Promise.all(block.transactions.map(transactionHash => (
      this.handleTransaction(transactionEvents, abiEventEvents, provider, network, block, transactionHash)
    )))
    await this.matchHandler.endBlock(network, blockNumber)
  }

  handleTransaction = async (transactionEvents: EventEntity[], abiEventEvents: EventEntity[], provider: BaseProvider, network: Network, block: Block, transactionHash: string) => {
    const transactionResponse: TransactionResponse = await provider.getTransaction(transactionHash)
    const transactionReceipt: TransactionReceipt = await provider.getTransactionReceipt(transactionHash)
    if (transactionReceipt) {
      const transaction: Transaction = createTransaction(transactionResponse, transactionReceipt)
      if (transactionEvents.length) {
        await this.eventsMatcher.match(transactionEvents, network, block, transaction, undefined)
      }
      if (transactionReceipt.logs && transactionReceipt.logs.length) {
        await Promise.all(transactionReceipt.logs.map(log => (
          this.handleLog(abiEventEvents, network, block, transaction, log)
        )))
      }
    } else {
      debug(`Skipping transaction ${transactionHash} for block ${block.number}: No receipt`)
    }
  }

  handleLog = async (abiEventEvents: EventEntity[], network: Network, block: Block, transaction: Transaction, log: Log) => {
    if (abiEventEvents.length) {
      await this.eventsMatcher.match(abiEventEvents, network, block, transaction, log)
    }
  }
}
