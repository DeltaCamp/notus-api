export enum VariableTypeTitle {
  BLOCK_NUMBER = 'block number',
  BLOCK_DIFFICULTY = 'block difficulty',
  BLOCK_TIMESTAMP = 'block timestamp',
  BLOCK_GAS_LIMIT = 'block gas limit',
  BLOCK_GAS_USED = 'block gas used',
  BLOCK_MINER = 'miner address',
  TRANSACTION_CREATES = 'created contract address',
  TRANSACTION_TO = 'transaction to',
  TRANSACTION_DATA = 'transaction data',
  TRANSACTION_FROM = 'transaction from',
  TRANSACTION_GAS_LIMIT = 'transaction gas limit',
  TRANSACTION_GAS_PRICE = 'transaction gas price',
  TRANSACTION_NONCE = 'transaction nonce',
  TRANSACTION_VALUE = 'transaction value',
  TRANSACTION_CHAIN_ID = 'transaction chainId',
  TRANSACTION_CONTRACT_ADDRESS = 'transaction contractAddress',
  TRANSACTION_CUMULATIVE_GAS_USED = 'transaction cumulativeGasUsed',
  TRANSACTION_GAS_USED = 'transaction gas used',
  LOG_ADDRESS = 'log address', // originator address
  LOG_TOPIC_0 = 'log topic[0]', // eventSignature(x, y, z)
  LOG_TOPIC_1 = 'log topic[1]',
  LOG_TOPIC_2 = 'log topic[2]',
  LOG_TOPIC_3 = 'log topic[3]',
  LOG_DATA = 'log data'
}
