import { ethers } from 'ethers'
import { BigNumber } from 'ethers/utils'

export function formatWei(wei: BigNumber): string {
  if (wei.lt(ethers.utils.parseUnits('0.001', 'gwei'))) {
    return `${wei.toString()} wei`
  } else if (wei.lt(ethers.utils.parseEther('0.001'))) {
    return `${ethers.utils.formatUnits(wei, 'gwei')} gwei`
  } else {
    return `${ethers.utils.formatEther(wei)} ether`
  }
}