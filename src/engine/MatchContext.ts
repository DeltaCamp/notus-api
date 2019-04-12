import { Block, Log } from 'ethers/providers';
import { get } from 'lodash';
import { BigNumber, bigNumberify } from 'ethers/utils';

import { Transaction } from './Transaction'

export class MatchContext {
  constructor (
    private readonly block: Block,
    private readonly transaction: Transaction,
    private readonly log: Log
  ) {}

  get(source: string) {
    return get(this, source)
  }
}
