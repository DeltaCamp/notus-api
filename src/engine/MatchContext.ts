import { Block, Log } from 'ethers/providers';
import { Network } from 'ethers/utils/networks';
import { get } from 'lodash';

import { Transaction } from './Transaction'
import { LogDescription } from 'ethers/utils';

export class MatchContext {
  public event: Map<string, LogDescription>;

  constructor (
    public readonly block?: Block,
    public readonly transaction?: Transaction,
    public readonly log?: Log,
    public readonly network?: Network
  ) {
    this.event = new Map<string, LogDescription>()
  }

  get(source: string) {
    return get(this, source)
  }

  clone() {
    return new MatchContext(this.block, this.transaction, this.log, this.network)
  }
}
