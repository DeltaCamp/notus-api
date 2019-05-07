import { ethers } from 'ethers'
import { formatWei } from '../formatWei'

describe('formatWei', () => {
  it('should nicely format as ether', () => {
    expect(formatWei(ethers.utils.parseEther('1.1'))).toEqual('1.1 ether')
  })

  it('should nicely format as ether', () => {
    expect(formatWei(ethers.utils.parseUnits('1000', 'wei'))).toEqual('1000 wei')
  })

  it('should nicely format as gwei', () => {
    expect(formatWei(ethers.utils.parseUnits('0.8', 'gwei'))).toEqual('0.8 gwei')
  })
})