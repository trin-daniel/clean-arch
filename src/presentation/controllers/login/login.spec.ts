import { LoginController } from './login'
import { badRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors'
import { EmailValidator } from '../signup/signup-protocols'

interface SystemUnderTestTypes{
  systemUnderTest: LoginController
  emailValidatorStub: EmailValidator
}
const makeEmailValidator = (): EmailValidator => {
  class EmailvaliadatorStub implements EmailValidator {
    isValid (email:string): boolean {
      return true
    }
  }
  return new EmailvaliadatorStub()
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const emailValidatorStub = makeEmailValidator()
  const systemUnderTest = new LoginController(emailValidatorStub)
  return {
    systemUnderTest,
    emailValidatorStub
  }
}

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const request = {
      body: {
        password: 'any_password'
      }
    }
    const error = new MissingParamError('email')
    const response = await systemUnderTest.handle(request)
    expect(response).toEqual(badRequest(error))
  })

  test('Should return 400 if no password is provided', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const request = {
      body: {
        email: 'any_email@gmail.com'
      }
    }
    const error = new MissingParamError('password')
    const response = await systemUnderTest.handle(request)
    expect(response).toEqual(badRequest(error))
  })

  test('Should call Emailvaliadator with correct email', async () => {
    const { systemUnderTest, emailValidatorStub } = makeSystemUnderTest()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const request = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }
    await systemUnderTest.handle(request)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@gmail.com')
  })
})
