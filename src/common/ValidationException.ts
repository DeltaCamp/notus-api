import { ValidationError } from 'class-validator'

export class ValidationException extends Error {
  
  constructor(
    message: string,
    public readonly errors: ValidationError[]
  ) {
    super(`${message}: ${errors.map(error => Object.values(error.constraints).join(', ')).join(', ')}`)
  }
}