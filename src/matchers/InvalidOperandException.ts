import { SolidityDataType } from "../common/SolidityDataType";

export class InvalidOperandException extends Error {
  
  constructor (
    public readonly dataType: SolidityDataType,
    public readonly operand: string
  ) {
    super(`Operand ${operand} is not a valid ${dataType}`)
  }

}