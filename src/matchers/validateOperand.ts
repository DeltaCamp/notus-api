import { ethers } from 'ethers'

import { SolidityDataType } from '../common/SolidityDataType'
import { InvalidOperandException } from './InvalidOperandException'

export function validateOperand(dataType: SolidityDataType, operand: string) {
  try {
    ethers.utils.defaultAbiCoder.encode([dataType], [operand])
  } catch (error) {
    throw new InvalidOperandException(dataType, operand)
  }
  return true
}