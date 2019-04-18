import { BigNumber, bigNumberify, getAddress } from 'ethers/utils';

import { MatchContext } from './MatchContext'
import {
  MatcherEntity,
  AbiEventInputEntity
} from '../entities'
import { Operator } from '../matchers'
import { SolidityDataType } from '../common/SolidityDataType'
import { SourceDataType } from '../matchers/SourceDataType'
import * as Source from '../matchers/Source'

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
    const { operand } = matcher
    const value = this.getSourceValue(matchContext, matcher)
    if (BigNumber.isBigNumber(value)) {
      return value.eq(operand)
    } else if (this.getSourceDataType(matcher) === SolidityDataType.ADDRESS) {
      return this.getAddress(value) === this.getAddress(operand)
    } else if (isNaN(value)) {
      return value === operand
    } else {
      return value === Number(operand)
    }
  }

  lt(matchContext, matcher): boolean {
    const { operand } = matcher
    const value = this.getSourceValue(matchContext, matcher)
    if (BigNumber.isBigNumber(value)) {
      return value.lt(operand)
    } else if (isNaN(value)) {
      return false
    } else {
      return value < Number(operand)
    }
  }

  gt(matchContext, matcher): boolean {
    const { operand } = matcher
    const value = this.getSourceValue(matchContext, matcher)
    if (BigNumber.isBigNumber(value)) {
      return value.gt(operand)
    } else if (isNaN(value)) {
      return false
    } else {
      return value > Number(operand)
    }
  }

  lte(matchContext, matcher): boolean {
    const { operand } = matcher
    const value = this.getSourceValue(matchContext, matcher)
    if (BigNumber.isBigNumber(value)) {
      return value.lte(operand)
    } else if (isNaN(value)) {
      return false
    } else {
      return value <= Number(operand)
    }
  }

  gte(matchContext, matcher): boolean {
    const { operand } = matcher
    const value = this.getSourceValue(matchContext, matcher)
    if (BigNumber.isBigNumber(value)) {
      return value.gte(operand)
    } else if (isNaN(value)) {
      return false
    } else {
      return value >= Number(operand)
    }
  }

  getSourceValue(matchContext, matcher) {
    if (matcher.source === Source.CONTRACT_EVENT_INPUT) {
      const event = this.getEvent(matchContext, matcher.abiEventInput)
      return event[matcher.abiEventInput.name]
    }
    return matchContext.get(matcher.source)
  }

  getSourceDataType(matcher): SolidityDataType {
    if (matcher.source === Source.CONTRACT_EVENT_INPUT) {
      return matcher.abiEventInput.type
    }
    return SourceDataType[matcher.source]
  }

  getEvent(matchContext: MatchContext, abiEventInput: AbiEventInputEntity) {
    const { abiEvent } = abiEventInput
    if (!matchContext.event[abiEvent.name]) {
      const ethersInterface = abiEventInput.abiEvent.abi.interface()
      const { data, topics } = matchContext.log
      const values = ethersInterface.events[abiEvent.name].decode(data, topics)
      matchContext.event[abiEvent.name] = values
    }
    return matchContext.event[abiEvent.name]
  }

  getAddress(addr) {
    try {
      return getAddress(addr)
    } catch (error) {
      return '0x0000000000000000000000000000000000000000'
    }
  }
}
