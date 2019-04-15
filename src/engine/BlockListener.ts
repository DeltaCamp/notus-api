import { ethers } from 'ethers'
import { Block, Log, TransactionResponse, TransactionReceipt } from 'ethers/providers'

import { BlockHandler } from './BlockHandler'
import { createTransaction } from './createTransaction'
import { Transaction } from './Transaction'
import { EventEntity } from '../entities'
import { EventService } from '../events/EventService'
import { range } from 'lodash'
import { transactionContextRunner } from '../transactions'

const debug = require('debug')('notus:BlockListener')

export class BlockListener {
  blockQueue: number[] = [];

  constructor (
    private readonly provider,
    private readonly blockHandler: BlockHandler,
    private readonly eventService: EventService
  ) {}

  start() {
    this.provider.on('block', this.onBlockNumber)
  }

  stop() {
    this.provider.removeListener('block', this.onBlockNumber)
  }

  onBlockNumber = (blockNumber): Promise<any> => {
    debug(`Received block number ${blockNumber}`)
    return transactionContextRunner(async () => {
      const events = await this.eventService.findAllForMatch()
      await this.checkBlockNumber(events, blockNumber - parseInt(process.env.BLOCK_CONFIRMATION_LEVEL, 10))
    })
  }

  checkBlockNumber = async (events: EventEntity[], blockNumber) => {
    const block: Block = await this.provider.getBlock(blockNumber)
    await Promise.all(block.transactions.map(transactionHash => (
      this.handleTransaction(events, block, transactionHash)
    )))
  }

  handleTransaction = async (events: EventEntity[], block: Block, transactionHash: string) => {
    debug(`Checking ${events.length} for transaction: ${transactionHash}`)
    const transactionResponse: TransactionResponse = await this.provider.getTransaction(transactionHash)
    const transactionReceipt: TransactionReceipt = await this.provider.getTransactionReceipt(transactionHash)
    if (transactionReceipt) {
      const transaction: Transaction = createTransaction(transactionResponse, transactionReceipt)
      if (transactionReceipt.logs && transactionReceipt.logs.length) {
        await Promise.all(transactionReceipt.logs.map(log => (
          this.handleLog(events, block, transaction, log)
        )))
      } else {
        await this.blockHandler.handleBlock(events, block, transaction, { address: transaction.to, data: '', topics: [] })
      }
    } else {
      debug(`Skipping transaction ${transactionHash} for block ${block.number}`)
    }
  }

  handleLog = async (events: EventEntity[], block: Block, transaction: Transaction, log: Log) => {
    debug(`Checking ${events.length} events for log: ${log.transactionHash}:${log.logIndex}`)
    await this.blockHandler.handleBlock(events, block, transaction, log)
  }
}
