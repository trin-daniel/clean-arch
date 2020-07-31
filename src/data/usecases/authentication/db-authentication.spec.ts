import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'

describe('DbAuthentication usecase', () => {
  test('Should call LoadAccountByEmailRepository with correct  email', async () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      public async load (email:string):Promise<AccountModel> {
        const account:AccountModel = {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@gmail.com',
          password: 'any_password'
        }
        return new Promise(resolve => resolve(account))
      }
    }
    const loadByAccountRepositoryStub = new LoadAccountByEmailRepositoryStub()
    const systemUnderTest = new DbAuthentication(loadByAccountRepositoryStub)
    const loadSpy = jest.spyOn(loadByAccountRepositoryStub, 'load')
    await systemUnderTest.auth({
      email: 'any_email@gmail.com',
      password: 'any_password'
    })
    expect(loadSpy).toHaveBeenCalledWith('any_email@gmail.com')
  })
})
