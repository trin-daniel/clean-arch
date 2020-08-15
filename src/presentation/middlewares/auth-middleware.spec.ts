import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccountModel } from '../../domain/models/account'
import { HttpRequest } from '../protocols'

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

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const systemUnderTest = new AuthMiddleware(loadAccountByTokenStub)
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

describe('Auth middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const response = await systemUnderTest.handle({})
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call loadAccountByToken with correct accessToken', async () => {
    const { systemUnderTest, loadAccountByTokenStub } = makeSystemUnderTest()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await systemUnderTest.handle(makeFakeRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
})
