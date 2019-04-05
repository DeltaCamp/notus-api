import { ethers } from 'ethers'
import { Block, Log, TransactionResponse, TransactionReceipt } from 'ethers/providers'

import { BlockHandler } from './BlockHandler'
import { createTransaction } from './createTransaction'
import { Transaction } from './Transaction'
import { EventService, EventEntity } from '../events'
import { range } from 'lodash'

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

  onBlockNumber = async (blockNumber) => {
    debug(`Received block number ${blockNumber}`)
    const events = await this.eventService.findAllForMatch()
    // await Promise.all(range(blockNumber - 8, blockNumber - 4).map(async (bn) => {
    await this.checkBlockNumber(events, blockNumber - 8)
    // }))
  }

  checkBlockNumber = async (events: EventEntity[], blockNumber) => {
    const block: Block = await this.provider.getBlock(blockNumber)
    await Promise.all(block.transactions.map(transactionHash => (
      this.handleTransaction(events, block, transactionHash)
    )))
  }

  handleTransaction = async (events: EventEntity[], block: Block, transactionHash: string) => {
    const transactionResponse: TransactionResponse = await this.provider.getTransaction(transactionHash)
    const transactionReceipt: TransactionReceipt = await this.provider.getTransactionReceipt(transactionHash)
    if (transactionReceipt) {
      await Promise.all(transactionReceipt.logs.map(log => (
        this.handleLog(events, block, transactionResponse, transactionReceipt, log)
      )))
    } else {
      debug(`Skipping transaction ${transactionHash} for block ${block.number}`)
    }
  }

  handleLog = async (events: EventEntity[], block: Block, transactionResponse: TransactionResponse, transactionReceipt: TransactionReceipt, log: Log) => {
    // debug(`Checking log ${log.transactionHash}:${log.logIndex}`)
    const transaction: Transaction = createTransaction(transactionResponse, transactionReceipt)
    await this.blockHandler.handleBlock(events, block, transaction, log)
  }
}
