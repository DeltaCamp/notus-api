import { ethers } from 'ethers'
import { BaseProvider } from 'ethers/providers';

export class EthersProvider {
  private providers: {} = {}

  getNetworkProvider(network: string): BaseProvider {
    let provider: BaseProvider = this.providers[network]
    if (!provider) {
      if (network === 'localhost' || network === 'unknown') {
        provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
      } else {
        provider = ethers.getDefaultProvider(network)
      }
      this.providers[network] = provider
    }
    return provider
  }

}