export class ClassValidationError extends Error {
  constructor (
    private readonly classValidatorErrors
  ) {
    super(`Entity failed class validation`)
  }
}