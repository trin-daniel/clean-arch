import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('hash_final'))
  },
  async compare ():Promise<boolean> {
    return new Promise(resolve => resolve(true))
  }
}))
const salt = 12
const makeSystemUnderTest = ():BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Cryptographic password layer', () => {
  describe('BcryptAdpter method hash', () => {
    test('Should call hash with correct value', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const hashSpy = jest.spyOn(bcrypt, 'hash')

      await systemUnderTest.hash('any_value')
      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('Should return a valid hash on hash success', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const hash = await systemUnderTest.hash('any_value')
      expect(hash).toBe('hash_final')
    })

    test('Should throw if hash throws', async () => {
      const systemUnderTest = makeSystemUnderTest()
      jest.spyOn(bcrypt, 'hash')
        .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
      const promise = systemUnderTest.hash('any_value')
      await expect(promise).rejects.toThrow()
    })
  })
  describe('BcryptAdpter method compare', () => {
    test('Should call compare with correct value', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const compareSpy = jest.spyOn(bcrypt, 'compare')

      await systemUnderTest.compare('any_value', 'any_hash')
      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })
    test('Should return true when compare succeeds', async () => {
      const systemUnderTest = makeSystemUnderTest()
      const available = await systemUnderTest.compare('any_value', 'any_hash')
      expect(available).toBe(true)
    })
    test('Should return false when compare fails', async () => {
      const systemUnderTest = makeSystemUnderTest()
      jest.spyOn(bcrypt, 'compare')
        .mockReturnValueOnce(
          new Promise(resolve => resolve(false))
        )
      const available = await systemUnderTest.compare('any_value', 'any_hash')
      expect(available).toBe(false)
    })

    test('Should throw if compare throws', async () => {
      const systemUnderTest = makeSystemUnderTest()
      jest.spyOn(bcrypt, 'compare')
        .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
      const promise = systemUnderTest.compare('any_value', 'any_hash')
      await expect(promise).rejects.toThrow()
    })
  })
})
