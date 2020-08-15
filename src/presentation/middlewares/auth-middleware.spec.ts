import {
  AccountModel,
  HttpRequest,
  LoadAccountByToken
} from './auth-middleware-protocols'

import {
  forbidden,
  success,
  serverError
} from '../helpers/http/http-helper'

import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'

interface SystemUnderTestTypes{
  systemUnderTest: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    public async load (token:string, role?:string):Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByTokenStub()
}

const makeSystemUnderTest = (role?:string): SystemUnderTestTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const systemUnderTest = new AuthMiddleware(loadAccountByTokenStub, role)
  return {
    systemUnderTest,
    loadAccountByTokenStub
  }
}

const makeFakeAccount = ():AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@gmail.com',
  password: 'hashed_password'
})

const makeFakeRequest = (): HttpRequest => ({
  headers: { 'x-access-token': 'any_token' }
})

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const response = await systemUnderTest.handle({})
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call loadAccountByToken with correct accessToken', async () => {
    const role = 'any_role'
    const { systemUnderTest, loadAccountByTokenStub } = makeSystemUnderTest(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await systemUnderTest.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token', role)
  })

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { systemUnderTest, loadAccountByTokenStub } = makeSystemUnderTest()
    jest.spyOn(loadAccountByTokenStub, 'load')
      .mockReturnValueOnce(
        new Promise(resolve => resolve(null))
      )
    const response = await systemUnderTest.handle(makeFakeRequest())
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const response = await systemUnderTest.handle(makeFakeRequest())
    expect(response).toEqual(success({ account_id: 'valid_id' }))
  })

  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { systemUnderTest, loadAccountByTokenStub } = makeSystemUnderTest()
    jest.spyOn(loadAccountByTokenStub, 'load')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const response = await systemUnderTest.handle(makeFakeRequest())
    expect(response).toEqual(serverError(new Error()))
  })
})
