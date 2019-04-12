import { BigNumber, bigNumberify, getAddress } from 'ethers/utils';

import { MatchContext } from './MatchContext'
import {
  MatcherEntity
} from '../entities'
import { Operator } from '../matchers'
import { SolidityDataType } from '../common/SolidityDataType'
import { SourceDataType } from '../matchers/SourceDataType'

const debug = require('debug')('notus:Matcher')

export class Matcher {

  matches(matchContext: MatchContext, matcher: MatcherEntity): boolean {
    switch(matcher.operator) {
      case Operator.EQ:
        return this.eq(matchContext, matcher)
        break;
      case Operator.LT:
        return this.lt(matchContext, matcher)
        break;
      case Operator.GT:
        return this.gt(matchContext, matcher)
        break;
      case Operator.LTE:
        return this.lte(matchContext, matcher)
        break;
      case Operator.GTE:
        return this.gte(matchContext, matcher)
        break;
      default:
        debug(`MatchContext: Unknown matcher type ${matcher.operator}`)
    }

    return false
  }

  eq(matchContext, matcher): boolean {
    const { source, operand } = matcher
    var sourceDataType = SourceDataType[source]
    const value = matchContext.get(source)
    if (BigNumber.isBigNumber(value)) {
      return value.eq(operand)
    } else if (SourceDataType[source] === SolidityDataType.ADDRESS) {
      return getAddress(value) === getAddress(operand)
    } else if (isNaN(value)) {
      return value === operand
    } else {
      return value === Number(operand)
    }
  }

  lt(matchContext, matcher): boolean {
    const { source, operand } = matcher
    const value = matchContext.get(source)
    if (BigNumber.isBigNumber(value)) {
      return value.lt(operand)
    } else if (isNaN(value)) {
      return false
    } else {
      return value < Number(operand)
    }
  }

  gt(matchContext, matcher): boolean {
    const { source, operand } = matcher
    const value = matchContext.get(source)
    if (BigNumber.isBigNumber(value)) {
      return value.gt(operand)
    } else if (isNaN(value)) {
      return false
    } else {
      return value > Number(operand)
    }
  }

  lte(matchContext, matcher): boolean {
    const { source, operand } = matcher
    const value = matchContext.get(source)
    if (BigNumber.isBigNumber(value)) {
      return value.lte(operand)
    } else if (isNaN(value)) {
      return false
    } else {
      return value <= Number(operand)
    }
  }

  gte(matchContext, matcher): boolean {
    const { source, operand } = matcher
    const value = matchContext.get(source)
    if (BigNumber.isBigNumber(value)) {
      return value.gte(operand)
    } else if (isNaN(value)) {
      return false
    } else {
      return value >= Number(operand)
    }
  }
}
