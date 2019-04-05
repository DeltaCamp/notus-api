import { ethers } from 'ethers'
import { Block, Log } from 'ethers/providers'

import { Transaction } from '../Transaction'
import { Matcher } from '../Matcher'
import { MatchContext } from '../MatchContext'
import { MatcherEntity, MatcherType } from '../../matchers'
import { VariableEntity, VariableType } from '../../variables'

describe('MatchContext', () => {

  let matcher

  let matcherEntity, matchContext, block, transaction, log

  let variable

  beforeEach(() => {
    block = {
      number: 1234,
      difficulty: 999
    }
    transaction = {}
    log = {}

    variable = new VariableEntity()
    matcherEntity = new MatcherEntity()
    matcherEntity.variable = variable

    matchContext = new MatchContext(block, transaction, log)

    matcher = new Matcher()
  })

  describe('matches()', () => {
    describe('with numbers', () => {
      beforeEach(() => {
        variable.source = VariableType.BLOCK_TIMESTAMP
        block.timestamp = 183765779077962
      })

      it('eq when true', () => {
        matcherEntity.type = MatcherType.EQ
        matcherEntity.operand = '183765779077962'

        expect(matcher.matches(matchContext, matcherEntity)).toBeTruthy()
      })

      it('eq when false', () => {
        matcherEntity.type = MatcherType.EQ
        matcherEntity.operand = '183765779077963'

        expect(matcher.matches(matchContext, matcherEntity)).toBeFalsy()
      })

      it('lt when true', () => {
        matcherEntity.type = MatcherType.LT
        matcherEntity.operand = '183765779077963'

        expect(matcher.matches(matchContext, matcherEntity)).toBeTruthy()
      })

      it('lt when false', () => {
        matcherEntity.type = MatcherType.LT
        matcherEntity.operand = '183765779077961'

        expect(matcher.matches(matchContext, matcherEntity)).toBeFalsy()
      })

      it('gt when true', () => {
        matcherEntity.type = MatcherType.GT
        matcherEntity.operand = '183765779077961'

        expect(matcher.matches(matchContext, matcherEntity)).toBeTruthy()
      })

      it('gt when false', () => {
        matcherEntity.type = MatcherType.GT
        matcherEntity.operand = '183765779077964'

        expect(matcher.matches(matchContext, matcherEntity)).toBeFalsy()
      })

      it('lte when true', () => {
        matcherEntity.type = MatcherType.LTE
        matcherEntity.operand = '183765779077962'

        expect(matcher.matches(matchContext, matcherEntity)).toBeTruthy()
      })

      it('lte when false', () => {
        matcherEntity.type = MatcherType.LTE
        matcherEntity.operand = '183765779077961'

        expect(matcher.matches(matchContext, matcherEntity)).toBeFalsy()
      })

      it('gte when true', () => {
        matcherEntity.type = MatcherType.GTE
        matcherEntity.operand = '183765779077964'

        expect(matcher.matches(matchContext, matcherEntity)).toBeFalsy()
      })

      it('gte when false', () => {
        matcherEntity.type = MatcherType.GTE
        matcherEntity.operand = '183765779077962'

        expect(matcher.matches(matchContext, matcherEntity)).toBeTruthy()
      })
    })

    describe('with big numbers', () => {
      beforeEach(() => {
        variable.source = VariableType.TRANSACTION_GAS_LIMIT
        transaction.gasLimit = ethers.utils.bigNumberify('42')
      })

      it('eq should work', () => {
        matcherEntity.type = MatcherType.EQ
        matcherEntity.operand = '42'

        expect(matcher.matches(matchContext, matcherEntity)).toBeTruthy()
      })

      it('eq should not match when false', () => {
        matcherEntity.type = MatcherType.EQ
        matcherEntity.operand = '41'

        expect(matcher.matches(matchContext, matcherEntity)).toBeFalsy()
      })

      it('lt should be true when less than', () => {
        matcherEntity.type = MatcherType.LT
        matcherEntity.operand = '43'

        expect(matcher.matches(matchContext, matcherEntity)).toBeTruthy()
      })

      it('lt should be true when less than', () => {
        matcherEntity.type = MatcherType.LT
        matcherEntity.operand = '41'

        expect(matcher.matches(matchContext, matcherEntity)).toBeFalsy()
      })

      it('lt should be true when less than', () => {
        matcherEntity.type = MatcherType.GT
        matcherEntity.operand = '41'

        expect(matcher.matches(matchContext, matcherEntity)).toBeTruthy()
      })

      it('lt should be true when less than', () => {
        matcherEntity.type = MatcherType.GT
        matcherEntity.operand = '43'

        expect(matcher.matches(matchContext, matcherEntity)).toBeFalsy()
      })

      it('lt should be true when less than', () => {
        matcherEntity.type = MatcherType.LTE
        matcherEntity.operand = '42'

        expect(matcher.matches(matchContext, matcherEntity)).toBeTruthy()
      })
    })
  })
})
