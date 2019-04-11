import { ethers } from 'ethers'
import { Block, Log } from 'ethers/providers'

import { Transaction } from '../Transaction'
import { MatchContext } from '../MatchContext'
import {
  Operator
} from '../../matchers'
import {
  MatcherEntity,
  VariableEntity
} from '../../entities'
import { VariableType } from '../../variables'

describe('MatchContext', () => {

  let matchContext

  let block, transaction, log

  let variable, matcher

  beforeEach(() => {
    block = {
      number: 1234,
      difficulty: 999
    }
    transaction = {}
    log = {}

    variable = new VariableEntity()
    matcher = new MatcherEntity()
    matcher.variable = variable

    matchContext = new MatchContext(block, transaction, log)
  })

  describe('get()', () => {
    it(VariableType.BLOCK_NUMBER, () => {
      expect(matchContext.get(VariableType.BLOCK_NUMBER)).toEqual(block.number)
    })

    it(VariableType.BLOCK_DIFFICULTY, () => {
      expect(matchContext.get(VariableType.BLOCK_DIFFICULTY)).toEqual(block.difficulty)
    })

    it(VariableType.BLOCK_TIMESTAMP, () => {
      expect(matchContext.get(VariableType.BLOCK_TIMESTAMP)).toEqual(block.timestamp)
    })

    it(VariableType.BLOCK_GAS_LIMIT, () => {
      expect(matchContext.get(VariableType.BLOCK_GAS_LIMIT)).toEqual(block.gasLimit)
    })

    /*
    VariableType.BLOCK_GAS_USED
    VariableType.BLOCK_MINER
    VariableType.TRANSACTION_CREATES
    VariableType.TRANSACTION_TO
    VariableType.TRANSACTION_DATA
    VariableType.TRANSACTION_FROM
    VariableType.TRANSACTION_GAS_LIMIT
    VariableType.TRANSACTION_GAS_PRICE
    VariableType.TRANSACTION_NONCE
    VariableType.TRANSACTION_VALUE
    VariableType.TRANSACTION_CHAIN_ID
    VariableType.TRANSACTION_CONTRACT_ADDRESS
    VariableType.TRANSACTION_CUMULATIVE_GAS_USED
    VariableType.TRANSACTION_GAS_USED
    VariableType.LOG_ADDRESS
    VariableType.LOG_TOPIC_0
    VariableType.LOG_TOPIC_1
    VariableType.LOG_TOPIC_2
    VariableType.LOG_TOPIC_3
    VariableType.LOG_DATA
    */
  })
})
