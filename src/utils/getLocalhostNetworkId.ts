import { ethers } from 'ethers'

export async function getLocalhostNetworkId() {
  let provider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
  let network = await provider.getNetwork()
  return network.chainId
}