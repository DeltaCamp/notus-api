import { MetaDataType } from "../matchers/MetaDataType";
import { formatTimestamp } from "./formatTimestamp";
import { formatWei } from "./formatWei";
import { formatFixedPoint } from "./formatFixedPoint";

export function formatMetaDataType(value, metaDataType: MetaDataType) {
  if (!metaDataType) {
    return value
  } else if (metaDataType === MetaDataType.TIMESTAMP) {
    return formatTimestamp(value)
  } else if (metaDataType === MetaDataType.WEI) {
    return formatWei(value)
  } else {
    return formatFixedPoint(value, metaDataType)
  }
}