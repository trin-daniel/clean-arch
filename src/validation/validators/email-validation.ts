import { Validation } from '../../presentation/protocols'
import { InvalidParamErrors } from '../../presentation/errors'
import { EmailValidator } from '../protocols/email-validator'

export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly email:EmailValidator
  ) {}

  validate (input:any):Error {
    const available = this.email.isValid(input[this.fieldName])
    if (!available) {
      return new InvalidParamErrors(this.fieldName)
    }
  }
}
