import { Injectable } from '@nestjs/common'

import { BlockListener } from './BlockListener'

const debug = require('debug')('notus:engine:BlockListenerManager')

@Injectable()
export class BlockListenerManager {
  constructor (
    private readonly blockListener: BlockListener
  ) {}

  start() {
    debug(`Starting BlockListener on network "${process.env.ETHEREUM_NETWORK}"...`)
    this.blockListener.start(process.env.ETHEREUM_NETWORK)
  }

  stop() {
    this.blockListener.stop()
  }
}
