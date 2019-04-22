import { formatEtherscanBaseUrl } from './formatEtherscanBaseUrl'

export function formatEtherscanAddressUrl (address: string, networkId: number): string {
  return `${formatEtherscanBaseUrl(networkId)}/address/${address}`
}
