import { Injectable } from '@nestjs/common';
import { Block, Log, TransactionResponse, TransactionReceipt, BaseProvider } from 'ethers/providers'

import { EventScope } from '../events/EventScope'
import { EventsMatcher } from './EventsMatcher'
import { createTransaction } from './createTransaction'
import { Transaction } from './Transaction'
import { EventEntity } from '../entities'
import { EventService } from '../events/EventService'
import { transactionContextRunner } from '../transactions'
import { Network } from 'ethers/utils';
import { EthersProvider } from './EthersProvider';

const debug = require('debug')('notus:engine:BlockHandler')

@Injectable()
export class BlockHandler {
  private blockEvents: EventEntity[];
  private transactionEvents: EventEntity[];
  private abiEventEvents: EventEntity[];
  private network: Network;
  private provider: BaseProvider;

  constructor (
    private readonly ethersProvider: EthersProvider,
    private readonly eventsMatcher: EventsMatcher,
    private readonly eventService: EventService
  ) {}

  handle = (networkName: string, blockNumber: number): Promise<any> => {
    this.provider = this.ethersProvider.getNetworkProvider(networkName)
    return transactionContextRunner(async () => {
      this.network = await this.provider.getNetwork()
      await this.checkBlockNumber(blockNumber)
    })
  }

  checkBlockNumber = async (blockNumber) => {
    this.blockEvents = await this.eventService.findByScope(EventScope.BLOCK)
    this.transactionEvents = await this.eventService.findByScope(EventScope.TRANSACTION)
    this.abiEventEvents = await this.eventService.findByScope(EventScope.CONTRACT_EVENT)
    const block: Block = await this.provider.getBlock(blockNumber)
    debug(`Received block number ${block.number}`)
    if (this.blockEvents.length) {
      debug(`Checking events ${this.blockEvents.map(event => event.id).join(', ')} for block: ${blockNumber}`)
      await this.eventsMatcher.match(this.blockEvents, this.network, block, undefined, undefined)
    }
    await Promise.all(block.transactions.map(transactionHash => (
      this.handleTransaction(block, transactionHash)
    )))
  }

  handleTransaction = async (block: Block, transactionHash: string) => {
    const transactionResponse: TransactionResponse = await this.provider.getTransaction(transactionHash)
    const transactionReceipt: TransactionReceipt = await this.provider.getTransactionReceipt(transactionHash)
    if (transactionReceipt) {
      const transaction: Transaction = createTransaction(transactionResponse, transactionReceipt)
      if (this.transactionEvents.length) {
        debug(`Checking events ${this.transactionEvents.map(event => event.id).join(', ')} for transaction: ${transactionHash}`)
        await this.eventsMatcher.match(this.transactionEvents, this.network, block, transaction, undefined)
      }
      if (transactionReceipt.logs && transactionReceipt.logs.length) {
        await Promise.all(transactionReceipt.logs.map(log => (
          this.handleLog(block, transaction, log)
        )))
      }
    } else {
      debug(`Skipping transaction ${transactionHash} for block ${block.number}`)
    }
  }

  handleLog = async (block: Block, transaction: Transaction, log: Log) => {
    if (this.abiEventEvents.length) {
      debug(`Checking events ${this.abiEventEvents.map(event => event.id).join(', ')} for log: ${log.transactionHash}:${log.logIndex}`)
      await this.eventsMatcher.match(this.abiEventEvents, this.network, block, transaction, log)
    }
  }
}
