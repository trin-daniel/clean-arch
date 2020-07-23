import { EmailValidatorAdapter } from '../utils/email-validator'
describe('EmailValidator adapter', () => {
  test('Should be able return false if validator returns false', () => {
    const systemUnderTest = new EmailValidatorAdapter()
    const isValid = systemUnderTest.isValid('invalid_email@gmail.com')
    expect(isValid).toBe(false)
  })
})
