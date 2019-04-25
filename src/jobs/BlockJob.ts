export const BLOCK_JOB_NAME = 'BlockJob'

export interface BlockJob {
  networkName: string
  chainId: number
  blockNumber: number
}