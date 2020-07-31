import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'
import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { resolve } from 'path'

const makeFakeAccount = ():AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@gmail.com',
  password: 'any_password'
})

const makeLoadAccountByEmailRepository = ():LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    public async load (email:string):Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeFakeAuthentication = ():AuthenticationModel => ({
  email: 'any_email@gmail.com',
  password: 'any_password'
})

interface SystemUnderTestTypes{
  systemUnderTest:DbAuthentication,
  loadAccountByEmailRepositoryStub:LoadAccountByEmailRepository
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const systemUnderTest = new DbAuthentication(loadAccountByEmailRepositoryStub)
  return {
    loadAccountByEmailRepositoryStub,
    systemUnderTest
  }
}

describe('DbAuthentication usecase', () => {
  test('Should call LoadAccountByEmailRepository with correct  email', async () => {
    const {
      systemUnderTest,
      loadAccountByEmailRepositoryStub
    } = makeSystemUnderTest()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await systemUnderTest.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_email@gmail.com')
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const {
      systemUnderTest,
      loadAccountByEmailRepositoryStub
    } = makeSystemUnderTest()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const promise = systemUnderTest.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })
})
