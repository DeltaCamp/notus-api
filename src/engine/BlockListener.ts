import { Injectable } from '@nestjs/common';

import { EthersProvider } from './EthersProvider';
import { WorkLogService } from '../work-logs/WorkLogService';
import { BlockJobPublisher } from '../jobs/BlockJobPublisher';
import { transactionContextRunner } from '../transactions';
import { Network } from 'ethers/utils';
import { BaseProvider } from 'ethers/providers';
import { number } from 'joi';

const debug = require('debug')('notus:engine:BlockListener')

@Injectable()
export class BlockListener {
  public networkChecks: Map<number, Function>;
  private blockTimeouts: Map<number, number>;

  constructor (
    private readonly ethersProvider: EthersProvider,
    private readonly workLogService: WorkLogService,
    private readonly blockJobPublisher: BlockJobPublisher
  ) {
    this.networkChecks = new Map<number, Function>()
    this.blockTimeouts = new Map<number, number>()
  }

  async start(networkName: string) {
    debug(`Registering listener for '${networkName}'`)
    const provider = this.ethersProvider.getNetworkProvider(networkName)
    const network = await provider.getNetwork()
    if (this.networkChecks[network.chainId]) { throw new Error(`Provider already defined for network ${networkName}`) }
    this.networkChecks[network.chainId] = () => {
      this.checkNetwork(provider)
      this.startTimeout(network.chainId)
    }
    this.startTimeout(network.chainId)
  }

  startTimeout(chainId: number) {
    this.blockTimeouts[chainId] = setTimeout(this.networkChecks[chainId], 1000)
  }

  stop() {
    Object.keys(this.blockTimeouts).forEach((networkName: string) => {
      clearTimeout(this.blockTimeouts[networkName])
    })
  }

  firstReplayBlock(currentBlockNumber: number): number {
    const maxBlocks = parseInt(process.env.MAX_REPLAY_BLOCKS, 10)
    return currentBlockNumber - maxBlocks
  }

  confirmationLevel(): number {
    return parseInt(process.env.BLOCK_CONFIRMATION_LEVEL, 10)
  }

  checkNetwork = async (provider: BaseProvider) => {
    const network = await provider.getNetwork()
    const { chainId } = network
    const blockNumber = await provider.getBlockNumber()
    const currentBlockNumber = blockNumber - this.confirmationLevel()

    // Calculate the oldest block that might need replay
    const oldestReplayBlock = this.firstReplayBlock(currentBlockNumber)

    const lastCheckedBlock = await this.workLogService.getLastBlock(chainId)

    let startingBlock = Math.max(oldestReplayBlock, lastCheckedBlock + 1)

    if (startingBlock <= currentBlockNumber) {
      while (startingBlock <= currentBlockNumber) {
        debug(`newBlock(${startingBlock}, ${network.name}, ${chainId})`)
        this.blockJobPublisher.newBlock({ blockNumber: startingBlock, networkName: network.name, chainId })
        startingBlock += 1;
      }
  
      await transactionContextRunner(() => {
        return this.workLogService.setLastBlock(chainId, currentBlockNumber)
      })
    }
  }
}
