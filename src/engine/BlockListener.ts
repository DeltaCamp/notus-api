import { Block, Log, TransactionResponse, TransactionReceipt, BaseProvider } from 'ethers/providers'

import { EventScope } from '../events/EventScope'
import { BaseHandler } from './BaseHandler'
import { createTransaction } from './createTransaction'
import { Transaction } from './Transaction'
import { EventEntity } from '../entities'
import { EventService } from '../events/EventService'
import { transactionContextRunner } from '../transactions'
import { Network } from 'ethers/utils';

const debug = require('debug')('notus:BlockListener')

export class BlockListener {
  private blockEvents: EventEntity[];
  private transactionEvents: EventEntity[];
  private abiEventEvents: EventEntity[];
  private network: Network;

  constructor (
    private readonly provider: BaseProvider,
    private readonly baseHandler: BaseHandler,
    private readonly eventService: EventService
  ) {}

  async start() {
    this.network = await this.provider.getNetwork()
    console.log('network: ', this.network)
    this.provider.on('block', this.onBlockNumber)
  }

  stop() {
    this.provider.removeListener('block', this.onBlockNumber)
  }

  onBlockNumber = (blockNumber: number): Promise<any> => {
    return transactionContextRunner(async () => {
      this.blockEvents = await this.eventService.findByScope(EventScope.BLOCK)
      this.transactionEvents = await this.eventService.findByScope(EventScope.TRANSACTION)
      this.abiEventEvents = await this.eventService.findByScope(EventScope.CONTRACT_EVENT)
      await this.checkBlockNumber(blockNumber - parseInt(process.env.BLOCK_CONFIRMATION_LEVEL, 10))
    })
  }

  checkBlockNumber = async (blockNumber) => {
    const block: Block = await this.provider.getBlock(blockNumber)
    debug(`Received block number ${block.number}`)
    if (this.blockEvents.length) {
      debug(`Checking ${this.blockEvents.length} events for block: ${blockNumber}`)
      await this.baseHandler.handle(this.blockEvents, this.network, block, undefined, undefined)
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
        debug(`Checking ${this.transactionEvents.length} events for transaction: ${transactionHash}`)
        await this.baseHandler.handle(this.transactionEvents, this.network, block, transaction, undefined)
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
      debug(`Checking ${this.abiEventEvents.length} events for log: ${log.transactionHash}:${log.logIndex}`)
      await this.baseHandler.handle(this.abiEventEvents, this.network, block, transaction, log)
    }
  }
}
