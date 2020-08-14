import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccountModel } from '../../domain/models/account'

const makeFakeAccount = ():AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@gmail.com',
  password: 'hashed_password'
})

describe('Auth middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      public async load (token:string, role?:string):Promise<AccountModel> {
        return new Promise(resolve => resolve(makeFakeAccount()))
      }
    }

    const loadAccountByTokenStub = new LoadAccountByTokenStub()
    const systemUnderTest = new AuthMiddleware(loadAccountByTokenStub)
    const response = await systemUnderTest.handle({})
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call loadAccountByToken with correct accessToken', async () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      public async load (token:string, role?:string):Promise<AccountModel> {
        return new Promise(resolve => resolve(makeFakeAccount()))
      }
    }

    const loadAccountByTokenStub = new LoadAccountByTokenStub()
    const systemUnderTest = new AuthMiddleware(loadAccountByTokenStub)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await systemUnderTest.handle({
      headers: {
        'x-access-token': 'any_token'
      }
    })
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
})
