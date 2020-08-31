import {
  badRequest,
  serverError,
  unauthorized,
  success
} from '../../../helpers/http/http-helper'

import {
  HttpRequest,
  Authentication,
  Validation
} from './login-controller-protocols'

import { LoginController } from './login-controller'
import { MissingParamError } from '../../../errors'
import { AuthenticationParams } from '../../../../domain/usecases/account/authentication'

type SutTypes = {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input:any):Error {
      return null
    }
  }
  return new ValidationStub()
}

const mockAuthentication = ():Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationParams):Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new AuthenticationStub()
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const authenticationStub = mockAuthentication()
  const sut = new LoginController(authenticationStub, validationStub)
  return {
    sut,
    authenticationStub,
    validationStub
  }
}

const mockFakeRequest = ():HttpRequest => ({
  body: {
    email: 'any_email@gmail.com',
    password: 'any_password'
  }
})

describe('Sign-in Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => { throw new Error() })

    await sut.handle(mockFakeRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: 'any_email@gmail.com', password: 'any_password' })
  })

  test('Should return 401 if invalid credentials  are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(undefined)))

    const response = await sut.handle(mockFakeRequest())
    expect(response).toEqual(unauthorized())
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const response = await sut.handle(mockFakeRequest())

    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 200 if valid credentials  are provided', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(mockFakeRequest())

    expect(response).toEqual(success({ accessToken: 'any_token' }))
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    await sut.handle(mockFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(mockFakeRequest().body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))

    const response = await sut.handle(mockFakeRequest())
    expect(response).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
