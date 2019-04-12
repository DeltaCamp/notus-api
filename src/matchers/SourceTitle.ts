import * as Source from './Source'

export const SourceTitle = {
  [Source.BLOCK_NUMBER]: 'block number',
  [Source.BLOCK_DIFFICULTY]: 'block difficulty',
  [Source.BLOCK_TIMESTAMP]: 'block timestamp',
  [Source.BLOCK_GAS_LIMIT]: 'block gas limit',
  [Source.BLOCK_GAS_USED]: 'block gas used',
  [Source.BLOCK_MINER]: 'miner address',
  [Source.TRANSACTION_CREATES]: 'created contract address',
  [Source.TRANSACTION_TO]: 'transaction to',
  [Source.TRANSACTION_DATA]: 'transaction data',
  [Source.TRANSACTION_FROM]: 'transaction from',
  [Source.TRANSACTION_GAS_LIMIT]: 'transaction gas limit',
  [Source.TRANSACTION_GAS_PRICE]: 'transaction gas price',
  [Source.TRANSACTION_NONCE]: 'transaction nonce',
  [Source.TRANSACTION_VALUE]: 'transaction value',
  [Source.TRANSACTION_CHAIN_ID]: 'transaction chainId',
  [Source.TRANSACTION_CONTRACT_ADDRESS]: 'transaction contract address',
  [Source.TRANSACTION_CUMULATIVE_GAS_USED]: 'transaction cumulative gas used',
  [Source.TRANSACTION_GAS_USED]: 'transaction gas used',
  [Source.LOG_ADDRESS]: 'log address', // originator address
  [Source.LOG_TOPIC_0]: 'log topic 0', // eventSignature(x, y, z)
  [Source.LOG_TOPIC_1]: 'log topic 1',
  [Source.LOG_TOPIC_2]: 'log topic 2',
  [Source.LOG_TOPIC_3]: 'log topic 3',
  [Source.LOG_DATA]: 'log data'
}
