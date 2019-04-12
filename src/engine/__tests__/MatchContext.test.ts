import { ethers } from 'ethers'
import { Block, Log } from 'ethers/providers'

import { Transaction } from '../Transaction'
import { MatchContext } from '../MatchContext'
import * as Source from '../../matchers/Source'
import {
  Operator
} from '../../matchers'
import {
  MatcherEntity
} from '../../entities'

describe('MatchContext', () => {

  let matchContext

  let block, transaction, log

  let matcher

  beforeEach(() => {
    block = {
      number: 1234,
      difficulty: 999
    }
    transaction = {}
    log = {}

    matcher = new MatcherEntity()
    matcher.source = Source.TRANSACTION_TO

    matchContext = new MatchContext(block, transaction, log)
  })

  describe('get()', () => {
    it(Source.BLOCK_NUMBER, () => {
      expect(matchContext.get(Source.BLOCK_NUMBER)).toEqual(block.number)
    })

    it(Source.BLOCK_DIFFICULTY, () => {
      expect(matchContext.get(Source.BLOCK_DIFFICULTY)).toEqual(block.difficulty)
    })

    it(Source.BLOCK_TIMESTAMP, () => {
      expect(matchContext.get(Source.BLOCK_TIMESTAMP)).toEqual(block.timestamp)
    })

    it(Source.BLOCK_GAS_LIMIT, () => {
      expect(matchContext.get(Source.BLOCK_GAS_LIMIT)).toEqual(block.gasLimit)
    })

    /*
    Source.BLOCK_GAS_USED
    Source.BLOCK_MINER
    Source.TRANSACTION_CREATES
    Source.TRANSACTION_TO
    Source.TRANSACTION_DATA
    Source.TRANSACTION_FROM
    Source.TRANSACTION_GAS_LIMIT
    Source.TRANSACTION_GAS_PRICE
    Source.TRANSACTION_NONCE
    Source.TRANSACTION_VALUE
    Source.TRANSACTION_CHAIN_ID
    Source.TRANSACTION_CONTRACT_ADDRESS
    Source.TRANSACTION_CUMULATIVE_GAS_USED
    Source.TRANSACTION_GAS_USED
    Source.LOG_ADDRESS
    Source.LOG_TOPIC_0
    Source.LOG_TOPIC_1
    Source.LOG_TOPIC_2
    Source.LOG_TOPIC_3
    Source.LOG_DATA
    */
  })
})
