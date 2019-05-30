import { formatEtherscanBaseUrl } from './formatEtherscanBaseUrl'

export function formatEtherscanBlockUrl (blockNumber: string, networkId: number): string {
  return `${formatEtherscanBaseUrl(networkId)}/block/${blockNumber}`
}
