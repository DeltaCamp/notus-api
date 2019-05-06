import { MetaDataType } from './MetaDataType'

import * as Source from './Source'

export const SourceMetaDataType = {
  [Source.BLOCK_TIMESTAMP]: MetaDataType.TIMESTAMP,
  [Source.BLOCK_GAS_LIMIT]: MetaDataType.WEI,
  [Source.BLOCK_GAS_USED]: MetaDataType.WEI,
  [Source.TRANSACTION_GAS_LIMIT]: MetaDataType.WEI,
  [Source.TRANSACTION_GAS_PRICE]: MetaDataType.WEI,
  [Source.TRANSACTION_VALUE]: MetaDataType.WEI,
  [Source.TRANSACTION_GAS_USED]: MetaDataType.WEI
}
