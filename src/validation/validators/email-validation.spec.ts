import { EmailValidator } from '../protocols/email-validator'
import { EmailValidation } from './email-validation'
import { InvalidParamErrors } from '../../presentation/errors'

type SystemUnderTestTypes = {
  sut: EmailValidation,
  emailValidatorStub: EmailValidator,
}

const mockEmailValidator = ():EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email:string):boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeSut = (): SystemUnderTestTypes => {
  const emailValidatorStub = mockEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('EmailValidator', () => {
  test('Should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const error = sut.validate({ email: 'any_email@gmail.com' })
    expect(error).toEqual(new InvalidParamErrors('email'))
  })

  test('Should call emailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    sut.validate({ email: 'any_email@gmail.com' })
    expect(isValidSpy).toHaveBeenCalledWith('any_email@gmail.com')
  })

  test('Should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })

    expect(sut.validate).toThrow()
  })
})
