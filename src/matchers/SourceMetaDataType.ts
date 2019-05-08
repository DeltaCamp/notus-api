import { MetaDataType } from './MetaDataType'

import * as Source from './Source'

export const SourceMetaDataType = {
  [Source.BLOCK_TIMESTAMP]: MetaDataType.TIMESTAMP,
  [Source.TRANSACTION_GAS_PRICE]: MetaDataType.WEI,
  [Source.TRANSACTION_VALUE]: MetaDataType.WEI,
}
