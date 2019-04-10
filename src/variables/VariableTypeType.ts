import { SourceDataType } from './SourceDataType'

export enum VariableTypeType {
  BLOCK_NUMBER = SourceDataType.UINT256,
  BLOCK_DIFFICULTY = SourceDataType.UINT256,
  BLOCK_TIMESTAMP = SourceDataType.UINT256,
  BLOCK_GAS_LIMIT = SourceDataType.UINT256,
  BLOCK_GAS_USED = SourceDataType.UINT256,
  BLOCK_MINER = SourceDataType.ADDRESS,
  TRANSACTION_CREATES = SourceDataType.ADDRESS,
  TRANSACTION_TO = SourceDataType.ADDRESS,
  TRANSACTION_DATA = SourceDataType.BYTES,
  TRANSACTION_FROM = SourceDataType.ADDRESS,
  TRANSACTION_GAS_LIMIT = SourceDataType.UINT256,
  TRANSACTION_GAS_PRICE = SourceDataType.UINT256,
  TRANSACTION_NONCE = SourceDataType.BYTES,
  TRANSACTION_VALUE = SourceDataType.UINT256,
  TRANSACTION_CHAIN_ID = SourceDataType.UINT256,
  TRANSACTION_CONTRACT_ADDRESS = SourceDataType.ADDRESS,
  TRANSACTION_CUMULATIVE_GAS_USED = SourceDataType.UINT256,
  TRANSACTION_GAS_USED = SourceDataType.UINT256,
  LOG_ADDRESS = SourceDataType.ADDRESS, // originator address
  LOG_TOPIC_0 = SourceDataType.BYTES, // eventSignature(x, y, z)
  LOG_TOPIC_1 = SourceDataType.BYTES,
  LOG_TOPIC_2 = SourceDataType.BYTES,
  LOG_TOPIC_3 = SourceDataType.BYTES,
  LOG_DATA = SourceDataType.BYTES
}
