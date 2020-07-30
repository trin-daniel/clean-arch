import { Validation } from '../../protocols/validation'
import { InvalidParamErrors } from '../../errors'
import { EmailValidator } from '../../protocols/email-validator'

export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly email:EmailValidator
  ) {
    this.fieldName
    this.email
  }

  validate (input:any):Error {
    const available = this.email.isValid(input[this.fieldName])
    if (!available) {
      return new InvalidParamErrors(this.fieldName)
    }
  }
}
