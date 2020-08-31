import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator-adapter'
import { EmailValidator } from '../../validation/protocols/email-validator'

const makeSut = (): EmailValidator => {
  return new EmailValidatorAdapter()
}

jest.mock('validator', () => ({
  isEmail ():boolean {
    return true
  }
}))

describe('Email Validator adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const isValid = sut.isValid('invalid_email@gmail.com')
    expect(isValid).toBe(false)
  })

  test('Should return true if validator returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid_email@gmail.com')

    expect(isValid).toBe(true)
  })

  test('Should call validator with correct email', () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')

    sut.isValid('any_email@gmail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('any_email@gmail.com')
  })
})
