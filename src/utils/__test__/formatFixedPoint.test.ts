import { formatFixedPoint } from '../formatFixedPoint'
import { MetaDataType } from '../../matchers/MetaDataType';

describe('formatFixedPoint', () => {
  it('should correctly format a fixed point value', () => {
    expect(formatFixedPoint('1234', MetaDataType.FIXED_POINT_3)).toEqual('1.234')
    expect(formatFixedPoint('123456', MetaDataType.FIXED_POINT_5)).toEqual('1.23456')
  })

  it('should handle empty strings', () => {
    expect(formatFixedPoint('', MetaDataType.FIXED_POINT_5)).toEqual('0')
  })

  it('should handle zero', () => {
    expect(formatFixedPoint('0', MetaDataType.FIXED_POINT_5)).toEqual('0')
  })
})