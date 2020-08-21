import {
  AccountModel,
  Decrypter,
  LoadAccountByTokenRepository
} from './db-load-account-by-token-protocols'

import { DbLoadAccountByToken } from './db-load-account-by-token'

type SystemUnderTestTypes = {
  systemUnderTest: DbLoadAccountByToken,
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    public async decrypt ():Promise<string> {
      return new Promise(resolve => resolve('any_value'))
    }
  }
  return new DecrypterStub()
}

const makeFakeAccount = ():AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@gmail.com',
  password: 'hashed_password'
})

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    public async loadByToken (token:string, role?:string):Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const decrypterStub = makeDecrypter()
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository()
  const systemUnderTest = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
  return {
    systemUnderTest,
    decrypterStub,
    loadAccountByTokenRepositoryStub
  }
}

describe('DbLoadAccountByToken', () => {
  test('Should call Descrypter with correct values', async () => {
    const {
      systemUnderTest,
      decrypterStub
    } = makeSystemUnderTest()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')

    await systemUnderTest.load('any_token', 'any_role')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return null if Decrypter returns null', async () => {
    const { systemUnderTest, decrypterStub } = makeSystemUnderTest()
    jest.spyOn(decrypterStub, 'decrypt')
      .mockReturnValueOnce(
        new Promise(resolve => resolve(null))
      )

    const account = await systemUnderTest.load('any_token', 'any_role')
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const {
      systemUnderTest,
      loadAccountByTokenRepositoryStub
    } = makeSystemUnderTest()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')

    await systemUnderTest.load('any_token', 'any_role')
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })

  test('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const {
      systemUnderTest,
      loadAccountByTokenRepositoryStub
    } = makeSystemUnderTest()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockReturnValueOnce(
        new Promise(resolve => resolve(null))
      )

    const account = await systemUnderTest.load('any_token', 'any_role')
    expect(account).toBeNull()
  })

  test('Should return an account on success', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const account = await systemUnderTest.load('any_token', 'any_role')
    expect(account).toEqual(makeFakeAccount())
  })

  test('Should throw if Decrypter throws', async () => {
    const { systemUnderTest, decrypterStub } = makeSystemUnderTest()
    jest.spyOn(decrypterStub, 'decrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = systemUnderTest.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { systemUnderTest, loadAccountByTokenRepositoryStub } = makeSystemUnderTest()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = systemUnderTest.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })
})
