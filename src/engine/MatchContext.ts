import { Block, Log } from 'ethers/providers';
import { get } from 'lodash';
import { BigNumber, bigNumberify } from 'ethers/utils';

import { Transaction } from './Transaction'

export class MatchContext {
  public event: Object = {};

  constructor (
    public readonly block?: Block,
    public readonly transaction?: Transaction,
    public readonly log?: Log
  ) {}

  get(source: string) {
    return get(this, source)
  }

  clone() {
    return new MatchContext(this.block, this.transaction, this.log)
  }
}
