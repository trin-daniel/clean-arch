import { Decrypter } from '../../protocols/cryptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'

interface SystemUnderTestTypes{
  systemUnderTest: DbLoadAccountByToken,
  decrypterStub: Decrypter
}

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    public async decrypt ():Promise<string> {
      return new Promise(resolve => resolve('any_value'))
    }
  }
  return new DecrypterStub()
}

const makeSystemUnderTest = (): SystemUnderTestTypes => {
  const decrypterStub = makeDecrypter()
  const systemUnderTest = new DbLoadAccountByToken(decrypterStub)
  return {
    systemUnderTest,
    decrypterStub
  }
}

describe('DbLoadAccountByToken', () => {
  test('Should call Descrypter with correct values', async () => {
    const {
      systemUnderTest,
      decrypterStub
    } = makeSystemUnderTest()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')

    await systemUnderTest.load('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})
