import { validateOperand } from '../validateOperand'
import { SolidityDataType } from '../../common/SolidityDataType';
import { InvalidOperandException } from '../InvalidOperandException'

describe('validateOperand()', () => {
  it('should validate uint32 values', () => {
    expect(validateOperand(SolidityDataType.UINT32, '4294967295')).toBeTruthy()
    expect(() => {
      validateOperand(SolidityDataType.UINT32, '4294967296')
    }).toThrow()
  })

  it('should validate uint values', () => {
    expect(validateOperand(SolidityDataType.UINT, '115792089237316195423570985008687907853269984665640564039457584007913129639935')).toBeTruthy()
    expect(() => {
      validateOperand(SolidityDataType.UINT, '115792089237316195423570985008687907853269984665640564039457584007913129639936')
    }).toThrow()
  })

  it('should validate addresses', () => {
    expect(validateOperand(SolidityDataType.ADDRESS, '0x1234567890123456789012345678901234567890')).toBeTruthy()
    expect(() => {
      validateOperand(SolidityDataType.ADDRESS, 'hello')
    }).toThrow()
  })

  it('should validate bytes32', () => {
    expect(validateOperand(SolidityDataType.BYTES32, '0x12345678901234567890123456789012345678901234567890aa1234567890ee')).toBeTruthy()
    expect(() => {
      validateOperand(SolidityDataType.BYTES32, '0x1234567890123456789012345678901234567890123456789012345678903')
    }).toThrow(new InvalidOperandException(SolidityDataType.BYTES32,'0x1234567890123456789012345678901234567890123456789012345678903'))
  })
})