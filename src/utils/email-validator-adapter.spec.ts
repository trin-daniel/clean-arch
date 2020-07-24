import validator from 'validator'
import { EmailValidatorAdapter } from '../utils/email-validator-adapter'
import { EmailValidator } from '../presentation/protocols/email-validator'

const makeSystemUnderTest = (): EmailValidator => {
  return new EmailValidatorAdapter()
}

jest.mock('validator', () => ({
  isEmail ():boolean {
    return true
  }
}))

describe('Email Validator adapter', () => {
  test('Should return false if validator returns false', () => {
    const systemUnderTest = makeSystemUnderTest()
    jest.spyOn(validator, 'isEmail')
      .mockReturnValueOnce(false)

    const isValid = systemUnderTest.isValid('invalid_email@gmail.com')
    expect(isValid).toBe(false)
  })

  test('Should return true if validator returns true', () => {
    const systemUnderTest = makeSystemUnderTest()
    const isValid = systemUnderTest.isValid('valid_email@gmail.com')
    expect(isValid).toBe(true)
  })

  test('Should call validator with correct email', () => {
    const systemUnderTest = makeSystemUnderTest()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    systemUnderTest.isValid('any_email@gmail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('any_email@gmail.com')
  })
})
