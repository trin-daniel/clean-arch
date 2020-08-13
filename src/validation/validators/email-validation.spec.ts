import { EmailValidator } from '../protocols/email-validator'
import { EmailValidation } from './email-validation'
import { InvalidParamErrors } from '../../presentation/errors'

const makeEmailValidator = ():EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email:string):boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface SystemUnderTestTypes{
  systemUnderTest: EmailValidation,
  emailValidatorStub: EmailValidator,
}
const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const emailValidatorStub = makeEmailValidator()
  const systemUnderTest = new EmailValidation('email', emailValidatorStub)
  return {
    systemUnderTest,
    emailValidatorStub
  }
}

describe('EmailValidator', () => {
  test('Should return an error if EmailValidator returns false', () => {
    const { systemUnderTest, emailValidatorStub } = makeSystemUnderTest()
    jest.spyOn(emailValidatorStub, 'isValid')
      .mockReturnValueOnce(false)

    const error = systemUnderTest.validate({ email: 'any_email@gmail.com' })
    expect(error).toEqual(new InvalidParamErrors('email'))
  })

  test('Should call emailValidator with correct email', () => {
    const { systemUnderTest, emailValidatorStub } = makeSystemUnderTest()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    systemUnderTest.validate({ email: 'any_email@gmail.com' })
    expect(isValidSpy).toHaveBeenCalledWith('any_email@gmail.com')
  })

  test('Should throw if EmailValidator throws', () => {
    const { systemUnderTest, emailValidatorStub } = makeSystemUnderTest()
    jest.spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce(() => {
        throw new Error()
      })

    expect(systemUnderTest.validate).toThrow()
  })
})
