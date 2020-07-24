import { DbAddAccount } from '../add-account/db-add-account'

describe('dbAddAccount usecase', () => {
  test('Should call encrypter with correct password', async () => {
    class EncrypterStub {
      encrypt (value:string):Promise<string> {
        return new Promise((resolve) => {
          resolve('hashed_password')
        })
      }
    }
    const encrypterStub = new EncrypterStub()
    const systemUnderTest = new DbAddAccount(encrypterStub)
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const account = {
      name: 'valid_name',
      email: 'valid_email@gmail.com',
      password: 'valid_password'
    }
    await systemUnderTest.add(account)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})
