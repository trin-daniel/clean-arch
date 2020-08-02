import { DbAuthentication } from './db-authentication'
import
{
  AccountModel,
  LoadAccountByEmailRepository,
  AuthenticationModel,
  HashComparer,
  Encrypter,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'

const makeFakeAccount = ():AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@gmail.com',
  password: 'hashed_password'
})

const makeLoadAccountByEmailRepository = ():LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    public async loadByEmail (email:string):Promise<AccountModel> {
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

const MakeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value:string):Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new EncrypterStub()
}

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id:string, token:string):Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

const makeFakeAuthentication = ():AuthenticationModel => ({
  email: 'any_email@gmail.com',
  password: 'any_password'
})

interface SystemUnderTestTypes{
  systemUnderTest:DbAuthentication,
  loadAccountByEmailRepositoryStub:LoadAccountByEmailRepository,
  hashComparerStub: HashComparer,
  encrypterStub: Encrypter,
  updateAccessTokenRepositoryStub:UpdateAccessTokenRepository
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const encrypterStub = MakeEncrypter()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
  const systemUnderTest = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  )
  return {
    loadAccountByEmailRepositoryStub,
    systemUnderTest,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication usecase', () => {
  test('Should call LoadAccountByEmailRepository with correct  email', async () => {
    const {
      systemUnderTest,
      loadAccountByEmailRepositoryStub
    } = makeSystemUnderTest()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await systemUnderTest.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_email@gmail.com')
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const {
      systemUnderTest,
      loadAccountByEmailRepositoryStub
    } = makeSystemUnderTest()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(
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

    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null)
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

  test('Should call Encrypter with correct id', async () => {
    const {
      systemUnderTest,
      encrypterStub
    } = makeSystemUnderTest()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await systemUnderTest.auth(makeFakeAuthentication())
    expect(encryptSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if HashComparer throws', async () => {
    const {
      systemUnderTest,
      encrypterStub
    } = makeSystemUnderTest()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const promise = systemUnderTest.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should return a token on success', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const accessToken = await systemUnderTest.auth(makeFakeAuthentication())
    expect(accessToken).toBe('any_token')
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const {
      systemUnderTest,
      updateAccessTokenRepositoryStub
    } = makeSystemUnderTest()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    await systemUnderTest.auth(makeFakeAuthentication())
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const {
      systemUnderTest,
      updateAccessTokenRepositoryStub
    } = makeSystemUnderTest()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    )
    const promise = systemUnderTest.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })
})
