import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'
import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'

const makeFakeAccount = ():AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@gmail.com',
  password: 'hashed_password'
})

const makeLoadAccountByEmailRepository = ():LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    public async load (email:string):Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparer = ():HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (password: string, hash: string):Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  return new HashComparerStub()
}

const makeFakeAuthentication = ():AuthenticationModel => ({
  email: 'any_email@gmail.com',
  password: 'any_password'
})

interface SystemUnderTestTypes{
  systemUnderTest:DbAuthentication,
  loadAccountByEmailRepositoryStub:LoadAccountByEmailRepository
  hashComparerStub: HashComparer
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const systemUnderTest = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub)
  return {
    loadAccountByEmailRepositoryStub,
    systemUnderTest,
    hashComparerStub
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

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const {
      systemUnderTest,
      loadAccountByEmailRepositoryStub
    } = makeSystemUnderTest()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null)
    const accessToken = await systemUnderTest.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  test('Should call HashComparer with correct values', async () => {
    const {
      systemUnderTest,
      hashComparerStub
    } = makeSystemUnderTest()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await systemUnderTest.auth(makeFakeAuthentication())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('Should throw if HashComparer throws', async () => {
    const {
      systemUnderTest,
      hashComparerStub
    } = makeSystemUnderTest()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const promise = systemUnderTest.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if HashComparer returns false', async () => {
    const {
      systemUnderTest,
      hashComparerStub
    } = makeSystemUnderTest()

    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const accessToken = await systemUnderTest.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })
})
