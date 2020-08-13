import { DbAddAccount } from '../add-account/db-add-account'
import
{
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
  LoadAccountByEmailRepository,
  Hasher
} from './db-add-account-protocols'

const makeHasher = ():Hasher => {
  class HasherStub implements Hasher {
    hash (value:string):Promise<string> {
      return new Promise((resolve) => {
        resolve('hashed_password')
      })
    }
  }
  return new HasherStub()
}
const makeAddAccountRepostory = ():AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    public async add (account: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountRepositoryStub()
}

const makeLoadAccountByEmailRepository = ():LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    public async loadByEmail (email:string):Promise<AccountModel> {
      return new Promise(resolve => resolve(null))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}
interface SystemUnderTestTypes{
  systemUnderTest: DbAddAccount,
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSystemUnderTest = ():SystemUnderTestTypes => {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepostory()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const systemUnderTest = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
  return {
    systemUnderTest,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}
const makeFakeAccount = ():AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@gmail.com',
  password: 'hashed_password'
})

const makeFakeAccountData = ():AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@gmail.com',
  password: 'valid_password'
})

describe('dbAddAccount usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { hasherStub, systemUnderTest } = makeSystemUnderTest()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await systemUnderTest.add(makeFakeAccountData())
    expect(hashSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { hasherStub, systemUnderTest } = makeSystemUnderTest()
    jest.spyOn(hasherStub, 'hash')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = systemUnderTest.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { systemUnderTest, addAccountRepositoryStub } = makeSystemUnderTest()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await systemUnderTest.add(makeFakeAccountData())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@gmail.com',
      password: 'hashed_password'
    })
  })
  test('Should throw if AddAccountRepository throws', async () => {
    const { addAccountRepositoryStub, systemUnderTest } = makeSystemUnderTest()
    jest.spyOn(addAccountRepositoryStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = systemUnderTest.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return account in case success in creation', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const accountReturned = await systemUnderTest.add(makeFakeAccountData())
    expect(accountReturned).toEqual(makeFakeAccount())
  })

  test('Should return null if LoadAccountByEmailRepository not return null', async () => {
    const { systemUnderTest, loadAccountByEmailRepositoryStub } = makeSystemUnderTest()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(
        new Promise(resolve => resolve(makeFakeAccount()))
      )
    const accountReturned = await systemUnderTest.add(makeFakeAccountData())
    expect(accountReturned).toBeNull()
  })

  test('Should call LoadAccountByEmailRepository with correct  email', async () => {
    const {
      systemUnderTest,
      loadAccountByEmailRepositoryStub
    } = makeSystemUnderTest()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await systemUnderTest.add(makeFakeAccountData())
    expect(loadSpy).toHaveBeenCalledWith('valid_email@gmail.com')
  })
})
