import {
  AccountModel,
  AddAccountParams,
  AddAccountRepository,
  LoadAccountByEmailRepository,
  Hasher
} from './db-add-account-protocols'

import { DbAddAccount } from '@data/usecases/account/add-account/db-add-account'

type SutTypes = {
  sut: DbAddAccount,
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const mockHasher = ():Hasher => {
  class HasherStub implements Hasher {
    hash (value:string):Promise<string> {
      return new Promise((resolve) => {
        resolve('hashed_password')
      })
    }
  }
  return new HasherStub()
}

const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    public async add (account: AddAccountParams): Promise<AccountModel> {
      return new Promise(resolve => resolve(mockAccountModel()))
    }
  }
  return new AddAccountRepositoryStub()
}

const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    public async loadByEmail (email:string):Promise<AccountModel> {
      return new Promise(resolve => resolve(null))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const addAccountRepositoryStub = mockAddAccountRepository()
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}

const mockAccountModel = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@gmail.com',
  password: 'hashed_password'
})

const mockAccountParams = (): AddAccountParams => ({
  name: 'valid_name',
  email: 'valid_email@gmail.com',
  password: 'valid_password'
})

describe('dbAddAccount usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { hasherStub, sut } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')

    await sut.add(mockAccountParams())
    expect(hashSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { hasherStub, sut } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.add(mockAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(mockAccountParams())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@gmail.com',
      password: 'hashed_password'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { addAccountRepositoryStub, sut } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.add(mockAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return account in case success in creation', async () => {
    const { sut } = makeSut()
    const account = await sut.add(mockAccountParams())

    expect(account).toEqual(mockAccountModel())
  })

  test('Should return null if LoadAccountByEmailRepository not return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve(mockAccountModel()))

    const account = await sut.add(mockAccountParams())
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByEmailRepository with correct  email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')

    await sut.add(mockAccountParams())
    expect(loadSpy).toHaveBeenCalledWith('valid_email@gmail.com')
  })
})
