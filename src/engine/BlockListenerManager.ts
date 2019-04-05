import { Injectable } from '@nestjs/common'
import { ethers } from 'ethers'

import { BlockHandler } from './BlockHandler'
import { BlockListener } from './BlockListener'
import { EventService } from '../events'

const debug = require('debug')('notus:BlockListenerManager')

@Injectable()
export class BlockListenerManager {
  listeners: BlockListener[];

  constructor (
    private readonly blockHandler: BlockHandler,
    private readonly eventService: EventService
  ) {
    this.listeners = [];
  }

  start() {
    debug(`Starting BlockListenerManager...`)
    this.listeners.push(this.newListener('localhost'))
    // this.listeners.push(this.newListener('rinkeby'))
    // this.listeners.push(this.newListener('ropsten'))
    // this.listeners.push(this.newListener('kovan'))
  }

  stop() {
    this.listeners.forEach(listener => (
      listener.stop()
    ))
    this.listeners = []
  }

  newListener(network) {
    let provider
    if (network === 'localhost') {
      provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
    } else {
      provider = ethers.getDefaultProvider(network)
    }
    const listener = new BlockListener(provider, this.blockHandler, this.eventService)
    debug(`Starting BlockListener for ${network}`)
    listener.start()
    return listener
  }
}
