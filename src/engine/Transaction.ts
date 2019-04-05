import { Log } from 'ethers/providers'
import { BigNumber } from 'ethers/utils'

export interface Transaction {
  to?: string;
  from?: string;
  contractAddress?: string;
  transactionIndex?: number;
  root?: string;
  gasUsed?: BigNumber;
  logsBloom?: string;
  blockHash?: string;
  transactionHash?: string;
  logs?: Array<Log>;
  blockNumber?: number;
  confirmations?: number;
  cumulativeGasUsed?: BigNumber;
  byzantium: boolean;
  status?: number;
  timestamp?: number;
  raw?: string;
}
