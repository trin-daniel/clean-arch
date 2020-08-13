import { LoginController } from './login-controller'
import { badRequest, serverError, unauthorized, success } from '../../../helpers/http/http-helper'
import { MissingParamError } from '../../../errors'
import { HttpRequest, Authentication, Validation } from './login-controller-protocols'
import { AuthenticationModel } from '../../../../domain/usecases/authentication'

interface SystemUnderTestTypes{
  systemUnderTest: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input:any):Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeAuthentication = ():Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel):Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new AuthenticationStub()
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const validationStub = makeValidation()
  const authenticationStub = makeAuthentication()
  const systemUnderTest = new LoginController(authenticationStub, validationStub)
  return {
    systemUnderTest,
    authenticationStub,
    validationStub
  }
}

const makeFakeRequest = ():HttpRequest => ({
  body: {
    email: 'any_email@gmail.com',
    password: 'any_password'
  }
})

describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { systemUnderTest, authenticationStub } = makeSystemUnderTest()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
      .mockImplementationOnce(() => {
        throw new Error()
      })
    await systemUnderTest.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: 'any_email@gmail.com', password: 'any_password' })
  })

  test('Should return 401 if invalid credentials  are provided', async () => {
    const { systemUnderTest, authenticationStub } = makeSystemUnderTest()
    jest.spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(
        new Promise(resolve => resolve(undefined))
      )
    const response = await systemUnderTest.handle(makeFakeRequest())
    expect(response).toEqual(unauthorized())
  })

  test('Should return 500 if Authentication throws', async () => {
    const { systemUnderTest, authenticationStub } = makeSystemUnderTest()
    jest.spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const response = await systemUnderTest.handle(makeFakeRequest())
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 200 if valid credentials  are provided', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const response = await systemUnderTest.handle(makeFakeRequest())
    expect(response).toEqual(success({ accessToken: 'any_token' }))
  })

  test('Should call Validation with correct values', async () => {
    const { systemUnderTest, validationStub } = makeSystemUnderTest()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const request = makeFakeRequest()
    await systemUnderTest.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { systemUnderTest, validationStub } = makeSystemUnderTest()
    jest.spyOn(validationStub, 'validate')
      .mockReturnValueOnce(
        new MissingParamError('any_field')
      )
    const response = await systemUnderTest.handle(makeFakeRequest())
    expect(response).toEqual(
      badRequest(new MissingParamError('any_field'))
    )
  })
})
