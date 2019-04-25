import { Injectable } from '@nestjs/common';

import { EthersProvider } from './EthersProvider';
import { WorkLogService } from '../work-logs/WorkLogService';
import { BlockJobPublisher } from '../jobs/BlockJobPublisher';
import { transactionContextRunner } from '../transactions';

const debug = require('debug')('notus:engine:BlockListener')

@Injectable()
export class BlockListener {
  private providers: {} = {};
  public onBlocks: {} = {};

  constructor (
    private readonly ethersProvider: EthersProvider,
    private readonly workLogService: WorkLogService,
    private readonly blockJobPublisher: BlockJobPublisher
  ) {}

  async start(networkName: string) {
    if (this.providers[networkName]) { throw new Error(`Provider already defined for network ${networkName}`) }
    const provider = this.ethersProvider.getNetworkProvider(networkName)
    this.providers[networkName] = provider
    const network = await provider.getNetwork()
    this.onBlocks[networkName] = (blockNumber: number) => this.onBlock(blockNumber, networkName, network.chainId)
    this.providers[networkName].on('block', this.onBlocks[networkName])
  }

  stop() {
    Object.keys(this.providers).forEach((networkName: string) => {
      this.providers[networkName].removeListener('block', this.onBlocks[networkName])
    })
  }

  firstCatchUpBlock(currentBlockNumber: number): number {
    const maxBlocks = parseInt(process.env.MAX_REPLAY_BLOCKS, 10)
    return currentBlockNumber - maxBlocks
  }

  confirmationLevel(): number {
    return parseInt(process.env.BLOCK_CONFIRMATION_LEVEL, 10)
  }

  onBlock = async (blockNumber: number, networkName: string, chainId: number) => {
    const currentBlockNumber = blockNumber - this.confirmationLevel()
    
    const firstCatchUpBlock = this.firstCatchUpBlock(currentBlockNumber)
    const lastCheckedBlock = await this.workLogService.getLastBlock(chainId)

    let startingBlock = Math.max(firstCatchUpBlock, lastCheckedBlock + 1)
    while (startingBlock <= currentBlockNumber) {
      debug(`newBlock(${startingBlock})`)
      this.blockJobPublisher.newBlock({ blockNumber: startingBlock, networkName, chainId })
      startingBlock += 1;
    }

    await transactionContextRunner(() => {
      return this.workLogService.setLastBlock(chainId, currentBlockNumber)
    })

    debug(`setLastBlock(${chainId}, ${currentBlockNumber})`)
  }
}
