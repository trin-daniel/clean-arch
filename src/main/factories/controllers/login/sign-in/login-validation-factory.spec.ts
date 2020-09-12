import { Validation } from '@presentation/protocols/validation'
import { EmailValidator } from '@validation/protocols/email-validator'
import { ValidationComposite, RequiredFieldValidation, EmailValidation } from '@validation/validators'
import { makeLoginValidation } from '@main/factories/controllers/login/sign-in/login-validation-factory'

jest.mock('@validation/validators/validation-composite')
const makeEmailValidator = ():EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email:string):boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('LoginValidation Factory ', () => {
  test('Should all ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations:Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(
        new RequiredFieldValidation(field)
      )
    }
    validations.push(
      new EmailValidation('email', makeEmailValidator())
    )
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
