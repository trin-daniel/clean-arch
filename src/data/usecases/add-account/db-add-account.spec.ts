import { DbAddAccount } from '../add-account/db-add-account'
import
{
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
  Encrypter
} from './db-add-account-protocols'

const makeEncrypter = ():Encrypter => {
  class EncrypterStub implements Encrypter {
    encrypt (value:string):Promise<string> {
      return new Promise((resolve) => {
        resolve('hashed_password')
      })
    }
  }
  return new EncrypterStub()
}
const makeAddAccountRepostory = ():AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    public async add (account: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve({
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@gmail.com',
        password: 'hashed_password'
      }))
    }
  }
  return new AddAccountRepositoryStub()
}
interface SystemUnderTestTypes{
  systemUnderTest: DbAddAccount,
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeSystemUnderTest = ():SystemUnderTestTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepostory()
  const systemUnderTest = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
  return {
    systemUnderTest,
    encrypterStub,
    addAccountRepositoryStub
  }
}

describe('dbAddAccount usecase', () => {
  test('Should call encrypter with correct password', async () => {
    const { encrypterStub, systemUnderTest } = makeSystemUnderTest()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const account = {
      name: 'valid_name',
      email: 'valid_email@gmail.com',
      password: 'valid_password'
    }
    await systemUnderTest.add(account)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Encrypter throws', async () => {
    const { encrypterStub, systemUnderTest } = makeSystemUnderTest()
    jest.spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const account = {
      name: 'valid_name',
      email: 'valid_email@gmail.com',
      password: 'valid_password'
    }
    const promise = systemUnderTest.add(account)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { systemUnderTest, addAccountRepositoryStub } = makeSystemUnderTest()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const account = {
      name: 'valid_name',
      email: 'valid_email@gmail.com',
      password: 'valid_password'
    }
    await systemUnderTest.add(account)
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
    const account = {
      name: 'valid_name',
      email: 'valid_email@gmail.com',
      password: 'valid_password'
    }
    const promise = systemUnderTest.add(account)
    await expect(promise).rejects.toThrow()
  })

  test('Should return account in case success in creation', async () => {
    const { systemUnderTest } = makeSystemUnderTest()
    const account = {
      name: 'valid_name',
      email: 'valid_email@gmail.com',
      password: 'hashed_password'
    }
    const accountReturned = await systemUnderTest.add(account)
    expect(accountReturned).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@gmail.com',
      password: 'hashed_password'
    })
  })
})
