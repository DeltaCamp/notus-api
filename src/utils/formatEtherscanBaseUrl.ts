export function formatEtherscanBaseUrl (networkId: number): string {
  var baseUrl: string
  switch (networkId) {
    case 3:
      baseUrl = 'https://ropsten.etherscan.io'
      break
    case 4:
      baseUrl = 'https://rinkeby.etherscan.io'
      break
    case 42:
      baseUrl = 'https://kovan.etherscan.io'
      break
    default:
      baseUrl = 'https://etherscan.io'
      break
  }
  return baseUrl
}
