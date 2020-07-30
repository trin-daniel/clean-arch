import { Validation } from '../../protocols/validation'
import { InvalidParamErrors } from '../../errors'

export class CompareFieldsValidation implements Validation {
  constructor (
    private readonly fieldName:string,
    private readonly fieldToCompareName: string
  ) {
    this.fieldName
    this.fieldToCompareName
  }

  validate (input:any):Error {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return new InvalidParamErrors(this.fieldToCompareName)
    }
  }
}
