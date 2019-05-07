import { Transaction } from "../engine";
import { formatWei } from "../utils/formatWei";

const debug = require('debug')('notus:templates:TransactionView')

export class TransactionView {
  constructor (
    private readonly transaction: Transaction
  ) {}

  creates = () => {
    return this.transaction.creates
  }

  to = () => {
    return this.transaction.to
  }

  from = () => {
    return this.transaction.from
  }

  data = () => {
    return this.transaction.data
  }

  hash = () => {
    return this.transaction.hash
  }

  gasLimit = () => {
    return this.transaction.gasLimit
  }

  gasPrice = () => {
    return formatWei(this.transaction.gasPrice)
  }

  nonce = () => {
    return this.transaction.nonce
  }

  value = () => {
    return formatWei(this.transaction.value)
  }

  chainId = () => {
    return this.transaction.chainId
  }

  abiAddress = () => {
    return this.transaction.abiAddress
  }

  cumulativeGasUsed = () => {
    return this.transaction.cumulativeGasUsed
  }

  gasUsed() {
    return this.transaction.gasUsed
  }

}