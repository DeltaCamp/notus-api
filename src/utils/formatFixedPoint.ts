import { bigNumberify } from 'ethers/utils'
import { MetaDataType } from "../matchers/MetaDataType";

export function formatFixedPoint(value, metaDataType: MetaDataType) {
  value = bigNumberify(value)
  let regex = /fixedPoint(\d+)/.exec(metaDataType)
  if (!regex) { throw new Error('Not a fixed point MetaDataType') }
  let decimals = parseInt(regex[1], 10)
  if (value.eq(0)) {
    return '0'
  }
  let valueStr = value.toString()
  if (valueStr.length < decimals) {
    valueStr = Array(decimals).join('0') + valueStr
  }
  let remainder = valueStr.substring(valueStr.length - decimals, valueStr.length)
  let whole = bigNumberify(valueStr.substring(0, valueStr.length - decimals)).toString()
  return whole + '.' + remainder
}