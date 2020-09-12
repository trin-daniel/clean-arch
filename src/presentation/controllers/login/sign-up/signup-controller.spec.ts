import {
  AccountModel,
  AddAccount,
  AddAccountParams,
  Validation,
  Authentication,
  AuthenticationParams
} from '@presentation/controllers/login/sign-up/signup-controller-protocols'

import {
  success,
  serverError,
  badRequest,
  forbidden
} from '@presentation/helpers/http/http-helper'

import {
  MissingParamError,
  ServerError,
  EmailInUseError
} from '@presentation/errors'

import { HttpRequest } from '@presentation/protocols'
import { SignUpController } from '@presentation/controllers/login/sign-up/signup-controller'

type SutTypes = {
  sut: SignUpController,
  addAccountStub: AddAccount,
  validationStub: Validation
  authenticationStub: Authentication
}

const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams):Promise<AccountModel> {
      return new Promise((resolve) => resolve(mockAccount()))
    }
  }
  return new AddAccountStub()
}

const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input:any):Error {
      return null
    }
  }
  return new ValidationStub()
}

const mockAthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationParams):Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new AuthenticationStub()
}

const mockRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@gmail.com',
    password: 'any_password',
    confirmation: 'any_password'
  }
})

const mockAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'any_name',
  email: 'any_email@gmail.com',
  password: 'any_password'
})

const makeSut = (): SutTypes => {
  const addAccountStub = mockAddAccount()
  const validationStub = mockValidation()
  const authenticationStub = mockAthentication()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

describe('Sign-Up Controller', () => {
  test('Should return error 500 if an exception occurs in addAccount', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))

    const response = await sut.handle(mockRequest())
    expect(response).toEqual(serverError(new ServerError(new Error())))
  })

  test('Should call addAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')

    await sut.handle(mockRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'any_password'
    })
  })

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.resolve(null))

    const response = await sut.handle(mockRequest())
    expect(response).toEqual(forbidden(new EmailInUseError()))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(mockRequest())

    expect(response).toEqual(success({ accessToken: 'any_token' }))
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    await sut.handle(mockRequest())
    expect(validateSpy).toHaveBeenCalledWith(mockRequest().body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))

    const response = await sut.handle(mockRequest())
    expect(response).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.reject(new Error()))

    await sut.handle(mockRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: 'any_email@gmail.com', password: 'any_password' })
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.reject(new Error()))

    const response = await sut.handle(mockRequest())
    expect(response).toEqual(serverError(new Error()))
  })
})
