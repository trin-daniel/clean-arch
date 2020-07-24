import { DbAddAccount } from '../add-account/db-add-account'
import { Encrypter } from '../../protocols/encrypter'

interface SystemUnderTestTypes{
  systemUnderTest: DbAddAccount,
  encrypterStub: Encrypter
}
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
const makeSystemUnderTest = ():SystemUnderTestTypes => {
  const encrypterStub = makeEncrypter()
  const systemUnderTest = new DbAddAccount(encrypterStub)
  return {
    systemUnderTest,
    encrypterStub
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
})
