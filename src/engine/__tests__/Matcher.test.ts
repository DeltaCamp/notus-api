import { ethers } from 'ethers'
import { Matcher } from '../Matcher'
import { MatchContext } from '../MatchContext'
import { Operator } from '../../matchers'
import {
  MatcherEntity,
  AbiEventInputEntity,
  AbiEventEntity,
  AbiEntity
} from '../../entities'
import * as Source from '../../matchers/Source'
import { ERC20 } from './ERC20'
import { SolidityDataType } from '../../common/SolidityDataType';

describe('MatchContext', () => {

  let matcher

  let matcherEntity, matchContext, block, transaction, log

  beforeEach(() => {
    block = {
      number: 1234,
      difficulty: 999
    }
    transaction = {}
    log = {}

    matcherEntity = new MatcherEntity()

    matchContext = new MatchContext(block, transaction, log)

    matcher = new Matcher()
  })

  describe('matches()', () => {

    describe('with custom event inputs', () => {
      let abi, abiEvent, abiEventInput

      beforeEach(() => {
        abi = new AbiEntity()
        abi.abi = JSON.stringify(ERC20)
        abiEvent = new AbiEventEntity()
        abiEvent.name = 'Transfer'
        abiEventInput = new AbiEventInputEntity()
        abiEventInput.name = 'value'

        abiEventInput.abiEvent = abiEvent
        abiEvent.abi = abi

        log = {
          data: '0x0000000000000000000000000000000000000000000000000000000d661188c0',
          topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            '0x0000000000000000000000002f7973eee7b0e9bc205e805d8e8fde54184187da',
            '0x0000000000000000000000003f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be'
          ]
        }
        matchContext = new MatchContext(block, transaction, log)

        matcherEntity.source = Source.CONTRACT_EVENT_INPUT
        matcherEntity.abiEventInput = abiEventInput
        matcherEntity.operator = Operator.GT
        matcherEntity.operand = '400'
      })

      it('should be truthy when passing', () => {
        expect(matcher.matches(matchContext, matcherEntity)).toBeTruthy()
      })

      it('should be falsy when failing', () => {
        matcherEntity.operand = '67547000000'
        expect(matcher.matches(matchContext, matcherEntity)).toBeFalsy()
      })
    })

    describe('with numbers', () => {
      beforeEach(() => {
        matcherEntity.source = Source.BLOCK_TIMESTAMP
        block.timestamp = 183765779077962
      })

      it('eq when true', () => {
        matcherEntity.operator = Operator.EQ
        matcherEntity.operand = '183765779077962'

        expect(matcher.matches(matchContext, matcherEntity)).toBeTruthy()
      })

      it('eq when false', () => {
        matcherEntity.operator = Operator.EQ
        matcherEntity.operand = '183765779077963'

        expect(matcher.matches(matchContext, matcherEntity)).toBeFalsy()
      })

      it('lt when true', () => {
        matcherEntity.operator = Operator.LT
        matcherEntity.operand = '183765779077963'

        expect(matcher.matches(matchContext, matcherEntity)).toBeTruthy()
      })

      it('lt when false', () => {
        matcherEntity.operator = Operator.LT
        matcherEntity.operand = '183765779077961'

        expect(matcher.matches(matchContext, matcherEntity)).toBeFalsy()
      })

      it('gt when true', () => {
        matcherEntity.operator = Operator.GT
        matcherEntity.operand = '183765779077961'

        expect(matcher.matches(matchContext, matcherEntity)).toBeTruthy()
      })

      it('gt when false', () => {
        matcherEntity.operator = Operator.GT
        matcherEntity.operand = '183765779077964'

        expect(matcher.matches(matchContext, matcherEntity)).toBeFalsy()
      })

      it('lte when true', () => {
        matcherEntity.operator = Operator.LTE
        matcherEntity.operand = '183765779077962'

        expect(matcher.matches(matchContext, matcherEntity)).toBeTruthy()
      })

      it('lte when false', () => {
        matcherEntity.operator = Operator.LTE
        matcherEntity.operand = '183765779077961'

        expect(matcher.matches(matchContext, matcherEntity)).toBeFalsy()
      })

      it('gte when true', () => {
        matcherEntity.operator = Operator.GTE
        matcherEntity.operand = '183765779077964'

        expect(matcher.matches(matchContext, matcherEntity)).toBeFalsy()
      })

      it('gte when false', () => {
        matcherEntity.operator = Operator.GTE
        matcherEntity.operand = '183765779077962'

        expect(matcher.matches(matchContext, matcherEntity)).toBeTruthy()
      })
    })

    describe('with big numbers', () => {
      beforeEach(() => {
        matcherEntity.source = Source.TRANSACTION_GAS_LIMIT
        transaction.gasLimit = ethers.utils.bigNumberify('42')
      })

      it('eq should work', () => {
        matcherEntity.operator = Operator.EQ
        matcherEntity.operand = '42'

        expect(matcher.matches(matchContext, matcherEntity)).toBeTruthy()
      })

      it('eq should not match when false', () => {
        matcherEntity.operator = Operator.EQ
        matcherEntity.operand = '41'

        expect(matcher.matches(matchContext, matcherEntity)).toBeFalsy()
      })

      it('lt should be true when less than', () => {
        matcherEntity.operator = Operator.LT
        matcherEntity.operand = '43'

        expect(matcher.matches(matchContext, matcherEntity)).toBeTruthy()
      })

      it('lt should be true when less than', () => {
        matcherEntity.operator = Operator.LT
        matcherEntity.operand = '41'

        expect(matcher.matches(matchContext, matcherEntity)).toBeFalsy()
      })

      it('lt should be true when less than', () => {
        matcherEntity.operator = Operator.GT
        matcherEntity.operand = '41'

        expect(matcher.matches(matchContext, matcherEntity)).toBeTruthy()
      })

      it('lt should be true when less than', () => {
        matcherEntity.operator = Operator.GT
        matcherEntity.operand = '43'

        expect(matcher.matches(matchContext, matcherEntity)).toBeFalsy()
      })

      it('lt should be true when less than', () => {
        matcherEntity.operator = Operator.LTE
        matcherEntity.operand = '42'

        expect(matcher.matches(matchContext, matcherEntity)).toBeTruthy()
      })
    })
  })
})
