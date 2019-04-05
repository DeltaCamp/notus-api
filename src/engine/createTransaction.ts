import { TransactionReceipt, TransactionResponse } from 'ethers/providers'
import { Transaction } from './Transaction'

export function createTransaction(transactionResponse: TransactionResponse, transactionReceipt: TransactionReceipt): Transaction {
  return {
    ...transactionResponse,
    ...transactionReceipt
  }
}
