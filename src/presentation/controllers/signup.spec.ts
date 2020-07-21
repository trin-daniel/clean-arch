import { MissingParamError, InvalidParamErrors, ServerError } from '../errors'
import { SignUpController } from './signup'
import { EmailValidator } from '../protocols/email-validator'

interface SystemUnderTestTypes{
  systemUnderTest: SignUpController,
  emailValidatorStub: EmailValidator
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email:string):boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const systemUnderTest = new SignUpController(emailValidatorStub)
  return {
    systemUnderTest,
    emailValidatorStub
  }
}

describe('component signUp controller', () => {
  test('Should return error 400 if not specify name of client', () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const request = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password',
        confirmation: 'value equal of password field'
      }
    }
    const response = systemUnderTest.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('name'))
  })

  test('Should return error 400 if not specify e-mail of client', () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const request = {
      body: {
        name: 'any_name',
        password: 'any_password',
        confirmation: 'value equal of password field'
      }
    }
    const response = systemUnderTest.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('email'))
  })

  test('Should return error 400 if not specify password of client', () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const request = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        confirmation: 'value equal of password field'
      }
    }
    const response = systemUnderTest.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('password'))
  })

  test('Should return error 400 if not specify password confirmation of client', () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const request = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'value equal of password field'
      }
    }
    const response = systemUnderTest.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('confirmation'))
  })

  test('Should return error 400 if an invalid email is provider', () => {
    const { systemUnderTest, emailValidatorStub } = makeSystemUnderTest()
    jest.spyOn(emailValidatorStub, 'isValid')
      .mockReturnValueOnce(false)
    const request = {
      body: {
        name: 'any_name',
        email: 'invalid_email@gmail.com',
        password: 'any_password',
        confirmation: 'value equal of password field'
      }
    }
    const response = systemUnderTest.handle(request)
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamErrors('email'))
  })

  test('Should call emailValidator with correct email', () => {
    const { systemUnderTest, emailValidatorStub } = makeSystemUnderTest()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const request = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        confirmation: 'value equal of password field'
      }
    }
    systemUnderTest.handle(request)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@gmail.com')
  })

  test('Should return error 500 if an exception occurs', () => {
    class EmailValidatorStub implements EmailValidator {
      isValid ():boolean {
        throw new Error()
      }
    }
    const emailValidatorStub = new EmailValidatorStub()
    const systemUnderTest = new SignUpController(emailValidatorStub)
    const request = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        confirmation: 'value equal of password field'
      }
    }
    const response = systemUnderTest.handle(request)
    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError())
  })
})
