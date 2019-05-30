import { Injectable } from '@nestjs/common'

import { BlockListener } from './BlockListener'
import { useLocalhostNotMainnet } from '../utils/useLocalhostNotMainnet'

const debug = require('debug')('notus:engine:BlockListenerManager')

@Injectable()
export class BlockListenerManager {
  constructor (
    private readonly blockListener: BlockListener
  ) {}

  start() {
    if (useLocalhostNotMainnet()) {
      this.blockListener.start('localhost')
    } else {
      this.blockListener.start('homestead')
    }
    // this.blockListener.start('ropsten')
    this.blockListener.start('rinkeby')
    // this.blockListener.start('kovan')
    // this.blockListener.start('goerli')
  }

  stop() {
    this.blockListener.stop()
  }
}
