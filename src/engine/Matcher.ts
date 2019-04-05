import { BigNumber, bigNumberify, getAddress } from 'ethers/utils';

import { MatchContext } from './MatchContext'
import { MatcherEntity, MatcherType } from '../matchers'
import { SourceDataType } from '../variables'

const debug = require('debug')('notus:Matcher')

export class Matcher {

  matches(matchContext: MatchContext, matcher: MatcherEntity): boolean {
    var value = matchContext.get(matcher.variable.source)
    var sourceDataType = matcher.variable.sourceDataType
    switch(matcher.type) {
      case MatcherType.EQ:
        return this.eq(value, sourceDataType, matcher.operand)
        break;
      case MatcherType.LT:
        return this.lt(value, sourceDataType, matcher.operand)
        break;
      case MatcherType.GT:
        return this.gt(value, sourceDataType, matcher.operand)
        break;
      case MatcherType.LTE:
        return this.lte(value, sourceDataType, matcher.operand)
        break;
      case MatcherType.GTE:
        return this.gte(value, sourceDataType, matcher.operand)
        break;
      default:
        debug(`MatchContext: Unknown matcher type ${matcher.type}`)
    }

    return false
  }

  eq(value, sourceType: SourceDataType, operand): boolean {
    if (BigNumber.isBigNumber(value)) {
      return value.eq(operand)
    } else if (sourceType === SourceDataType.ADDRESS) {
      return getAddress(value) === getAddress(operand)
    } else if (isNaN(value)) {
      return value === operand
    } else {
      return value === Number(operand)
    }
  }

  lt(value, sourceType: SourceDataType, operand): boolean {
    if (BigNumber.isBigNumber(value)) {
      return value.lt(operand)
    } else if (isNaN(value)) {
      return false
    } else {
      return value < Number(operand)
    }
  }

  gt(value, sourceType: SourceDataType, operand): boolean {
    if (BigNumber.isBigNumber(value)) {
      return value.gt(operand)
    } else if (isNaN(value)) {
      return false
    } else {
      return value > Number(operand)
    }
  }

  lte(value, sourceType: SourceDataType, operand): boolean {
    if (BigNumber.isBigNumber(value)) {
      return value.lte(operand)
    } else if (isNaN(value)) {
      return false
    } else {
      return value <= Number(operand)
    }
  }

  gte(value, sourceType: SourceDataType, operand): boolean {
    if (BigNumber.isBigNumber(value)) {
      return value.gte(operand)
    } else if (isNaN(value)) {
      return false
    } else {
      return value >= Number(operand)
    }
  }
}
