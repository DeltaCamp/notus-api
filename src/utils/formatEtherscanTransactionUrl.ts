import { formatEtherscanBaseUrl } from './formatEtherscanBaseUrl'

export function formatEtherscanTransactionUrl (transactionHash: string, networkId: number): string {
  return `${formatEtherscanBaseUrl(networkId)}/tx/${transactionHash}`
}
