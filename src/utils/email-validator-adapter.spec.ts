import { EmailValidatorAdapter } from '../utils/email-validator'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail ():boolean {
    return true
  }
}))

describe('EmailValidator adapter', () => {
  test('Should return false if validator returns false', () => {
    const systemUnderTest = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail')
      .mockReturnValueOnce(false)

    const isValid = systemUnderTest.isValid('invalid_email@gmail.com')
    expect(isValid).toBe(false)
  })

  test('Should return true if validator returns true', () => {
    const systemUnderTest = new EmailValidatorAdapter()
    const isValid = systemUnderTest.isValid('valid_email@gmail.com')
    expect(isValid).toBe(true)
  })

  test('Should call validator with correct email', () => {
    const systemUnderTest = new EmailValidatorAdapter()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    systemUnderTest.isValid('any_email@gmail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('any_email@gmail.com')
  })
})