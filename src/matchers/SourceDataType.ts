import { SolidityDataType } from '../common/SolidityDataType'

import * as Source from './Source'

export const SourceDataType = {
  [Source.BLOCK_NUMBER]: SolidityDataType.UINT256,
  [Source.BLOCK_DIFFICULTY]: SolidityDataType.UINT256,
  [Source.BLOCK_TIMESTAMP]: SolidityDataType.UINT256,
  [Source.BLOCK_GAS_LIMIT]: SolidityDataType.UINT256,
  [Source.BLOCK_GAS_USED]: SolidityDataType.UINT256,
  [Source.BLOCK_MINER]: SolidityDataType.ADDRESS,
  [Source.TRANSACTION_CREATES]: SolidityDataType.ADDRESS,
  [Source.TRANSACTION_TO]: SolidityDataType.ADDRESS,
  [Source.TRANSACTION_DATA]: SolidityDataType.BYTES,
  [Source.TRANSACTION_FROM]: SolidityDataType.ADDRESS,
  [Source.TRANSACTION_GAS_LIMIT]: SolidityDataType.UINT256,
  [Source.TRANSACTION_GAS_PRICE]: SolidityDataType.UINT256,
  [Source.TRANSACTION_NONCE]: SolidityDataType.BYTES,
  [Source.TRANSACTION_VALUE]: SolidityDataType.UINT256,
  [Source.TRANSACTION_CHAIN_ID]: SolidityDataType.UINT256,
  [Source.TRANSACTION_CONTRACT_ADDRESS]: SolidityDataType.ADDRESS,
  [Source.TRANSACTION_CUMULATIVE_GAS_USED]: SolidityDataType.UINT256,
  [Source.TRANSACTION_GAS_USED]: SolidityDataType.UINT256,
  [Source.LOG_ADDRESS]: SolidityDataType.ADDRESS, // originator address
  [Source.LOG_TOPIC_0]: SolidityDataType.BYTES, // eventSignature(x, y, z)
  [Source.LOG_TOPIC_1]: SolidityDataType.BYTES,
  [Source.LOG_TOPIC_2]: SolidityDataType.BYTES,
  [Source.LOG_TOPIC_3]: SolidityDataType.BYTES,
  [Source.LOG_DATA]: SolidityDataType.BYTES
}
