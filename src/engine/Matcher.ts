import { BigNumber, bigNumberify } from 'ethers/utils';

import { MatchContext } from './MatchContext'
import { MatcherEntity, MatcherType } from '../matchers'

export class Matcher {

  matches(matchContext: MatchContext, matcher: MatcherEntity): boolean {
    var value = matchContext.get(matcher.variable.source)
    switch(matcher.type) {
      case MatcherType.EQ:
        return this.eq(value, matcher.operand)
        break;
      case MatcherType.LT:
        return this.lt(value, matcher.operand)
        break;
      case MatcherType.GT:
        return this.gt(value, matcher.operand)
        break;
      case MatcherType.LTE:
        return this.lte(value, matcher.operand)
        break;
      case MatcherType.GTE:
        return this.gte(value, matcher.operand)
        break;
      default:
        console.warn(`MatchContext: Unknown matcher type ${matcher.type}`)
    }

    return false
  }

  eq(value, operand): boolean {
    if (BigNumber.isBigNumber(value)) {
      return value.eq(operand)
    } else if (isNaN(value)) {
      return value === operand
    } else {
      return value === Number(operand)
    }
  }

  lt(value, operand): boolean {
    if (BigNumber.isBigNumber(value)) {
      return value.lt(operand)
    } else if (isNaN(value)) {
      return false
    } else {
      return value < Number(operand)
    }
  }

  gt(value, operand): boolean {
    if (BigNumber.isBigNumber(value)) {
      return value.gt(operand)
    } else if (isNaN(value)) {
      return false
    } else {
      return value > Number(operand)
    }
  }

  lte(value, operand): boolean {
    if (BigNumber.isBigNumber(value)) {
      return value.lte(operand)
    } else if (isNaN(value)) {
      return false
    } else {
      return value <= Number(operand)
    }
  }

  gte(value, operand): boolean {
    if (BigNumber.isBigNumber(value)) {
      return value.gte(operand)
    } else if (isNaN(value)) {
      return false
    } else {
      return value >= Number(operand)
    }
  }
}
