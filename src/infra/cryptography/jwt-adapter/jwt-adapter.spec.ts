import jwt from 'jsonwebtoken'
import { JwtAdapter } from '@infra/cryptography/jwt-adapter/jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return new Promise(resolve => resolve('any_token'))
  },
  async verify ():Promise<string> {
    return new Promise(resolve => resolve('any_value'))
  }
}))

const makeSystemUnderTest = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('Jwt Adapter', () => {
  describe('Jwt method sign', () => {
    test('Should call sign with correct values', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const signSpy = jest.spyOn(jwt, 'sign')
      await systemUnderTest.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })

    test('Should return a token on sign success', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const accessToken = await systemUnderTest.encrypt('any_id')
      expect(accessToken).toBe('any_token')
    })

    test('Should throw if sign throws', async () => {
      const systemUnderTest = makeSystemUnderTest()
      jest.spyOn(jwt, 'sign')
        .mockImplementationOnce(() => { throw new Error() })
      const promise = systemUnderTest.encrypt('any_id')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('Jwt method verify', () => {
    test('Should call verify with correct value', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const verifySpy = jest.spyOn(jwt, 'verify')

      await systemUnderTest.decrypt('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret')
    })

    test('Should return a value on verify success', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const value = await systemUnderTest.decrypt('any_token')
      expect(value).toBe('any_value')
    })

    test('Should throw if verify throws', async () => {
      const systemUnderTest = makeSystemUnderTest()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => { throw new Error() })
      const promise = systemUnderTest.decrypt('any_token')
      await expect(promise).rejects.toThrow()
    })
  })
})
